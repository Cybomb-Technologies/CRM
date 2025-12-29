const Document = require('../../../../models/file/sales/Document');

const getDocuments = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = { isDeleted: false };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const documents = await Document.find(query).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error fetching documents', error: error.message });
    }
};

const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findOne({ _id: id, isDeleted: false });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error fetching document', error: error.message });
    }
};

module.exports = { getDocuments, getDocumentById };
