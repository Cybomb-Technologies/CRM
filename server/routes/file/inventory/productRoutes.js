const express = require('express');
const router = express.Router();
const productController = require('../../../controllers/file/inventory/productController');
const auth = require('../../../middleware/auth');

// All routes are protected
router.use(auth);

// Bulk operations (Must be before /:id routes)
router.delete('/bulk/delete', productController.bulkDeleteProducts);
router.post('/bulk/import', productController.importProducts);
router.get('/bulk/export', productController.exportProducts);

// GET all products
router.get('/', productController.getAllProducts);

// POST create product (with image upload)
router.post('/', productController.uploadImage, productController.createProduct);

// GET single product
router.get('/:id', productController.getProduct);

// PUT update product (with image upload)
router.put('/:id', productController.uploadImage, productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;