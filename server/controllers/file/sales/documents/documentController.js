const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createDocument = require('./createDocument');
const { getDocuments, getDocumentById } = require('./readDocument');
const updateDocument = require('./updateDocument');
const deleteDocument = require('./deleteDocument');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "public/uploads/documents/";
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "doc-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

module.exports = {
    createDocument: [upload.single("file"), createDocument],
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
};
