const Document = require('../../../../models/file/sales/Document');

const createDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name, description, category, tags } = req.body;

        // Construct the file path relative to server root or public URL
        // Since we save to public/uploads/documents, the URL path would be /uploads/documents/filename
        const relativePath = `/uploads/documents/${req.file.filename}`;

        const newDoc = new Document({
            name: name || req.file.originalname,
            originalName: req.file.originalname,
            path: relativePath,
            mimeType: req.file.mimetype,
            size: req.file.size,
            description,
            category: category || 'general',
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : []
        });

        const savedDoc = await newDoc.save();
        res.status(201).json(savedDoc);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: 'Server error creating document', error: error.message });
    }
};

module.exports = createDocument;
