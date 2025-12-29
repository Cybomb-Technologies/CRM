const Document = require('../../../../models/file/sales/Document');

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete
        const document = await Document.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Document deleted successfully', documentId: document._id });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server error deleting document', error: error.message });
    }
};

module.exports = deleteDocument;
