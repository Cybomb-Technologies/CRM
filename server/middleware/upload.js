const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists - CORRECT PATH
const uploadPath = path.join(__dirname, "..", "public", "uploads", "profiles");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`✅ Created uploads directory: ${uploadPath}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `profile-${Date.now()}${path.extname(file.originalname)}`;
        console.log(`📁 Saving file as: ${uniqueName}`);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Multer error handler
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error("❌ Multer error:", err.message);
        return res.status(400).json({
            success: false,
            message: err.message || "File upload error",
        });
    }
    next();
};

module.exports = { upload, handleMulterError };