// controllers/file/inventory/purchaseOrderController.js

const PurchaseOrder = require('../../../models/file/inventory/PurchaseOrder');

// ================= CREATE =================
exports.createPurchaseOrder = async (req, res) => {
  try {
    const poNumber = await PurchaseOrder.generatePONumber();

    const purchaseOrder = new PurchaseOrder({
      ...req.body,
      orderNumber: poNumber
    });

    const savedPO = await purchaseOrder.save();

    res.status(201).json({
      success: true,
      data: savedPO
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= READ ALL =================
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchaseOrders.length,
      data: purchaseOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= READ ONE =================
exports.getPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE =================
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const updatedPO = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPO) {
      return res.status(404).json({
        success: false,
        message: 'Purchase Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPO
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= DELETE (SOFT) =================
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase Order not found'
      });
    }

    await purchaseOrder.softDelete();

    res.status(200).json({
      success: true,
      message: 'Purchase Order deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= BULK DELETE =================
exports.bulkDeletePurchaseOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    await PurchaseOrder.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true }
    );

    res.status(200).json({
      success: true,
      message: 'Purchase Orders deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= EXPORT =================
exports.exportPurchaseOrders = async (req, res) => {
  try {
    const data = await PurchaseOrder.find();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= UPDATE STATUS =================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedPO = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedPO) {
      return res.status(404).json({
        success: false,
        message: 'Purchase Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPO
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= SEARCH =================
exports.searchPurchaseOrders = async (req, res) => {
  try {
    const term = req.params.term;

    const results = await PurchaseOrder.find({
      $or: [
        { orderNumber: { $regex: term, $options: 'i' } },
        { vendorName: { $regex: term, $options: 'i' } },
        { subject: { $regex: term, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= FILTER =================
exports.filterPurchaseOrders = async (req, res) => {
  try {
    const filters = req.body;

    const results = await PurchaseOrder.find(filters);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ================= STATS =================
exports.getPurchaseOrderStats = async (req, res) => {
  try {
    const stats = await PurchaseOrder.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$totals.total' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= STATUS STATS =================
exports.getStatusStats = async (req, res) => {
  try {
    const stats = await PurchaseOrder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
