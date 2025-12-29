const Document = require('../../../../models/file/sales/Document');

const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const document = await Document.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Server error updating document', error: error.message });
    }
};

module.exports = updateDocument;
