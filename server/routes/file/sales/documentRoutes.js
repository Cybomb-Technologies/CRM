const express = require('express');
const router = express.Router();
const documentController = require('../../../controllers/file/sales/documents/documentController');

// Route: /api/file/sales/documents

// Create a new document
router.post('/', documentController.createDocument);

// Get all documents
router.get('/', documentController.getDocuments);

// Get single document
router.get('/:id', documentController.getDocumentById);

// Update document
router.put('/:id', documentController.updateDocument);

// Delete document
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
