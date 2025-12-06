// server/controllers/file/sales/leads/updateLead.js
const Lead = require("../../../../models/file/sales/Lead");
const fs = require("fs");

// Update lead
const updateLead = async (req, res) => {
  try {
    // Handle image upload if present
    let imageData = null;
    if (req.file) {
      imageData = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
        filename: req.file.filename,
      };
      // Remove the temporary file
      fs.unlinkSync(req.file.path);
    }

    // Parse update data from request body or from data field (for FormData)
    let updateData = {};

    if (req.body.data) {
      // If data is sent as JSON string (FormData case)
      try {
        updateData = JSON.parse(req.body.data);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        updateData = req.body;
      }
    } else {
      // Regular JSON request
      updateData = req.body;
    }

    updateData.updatedAt = Date.now();

    // Add image data if uploaded
    if (imageData) {
      updateData.image = imageData;
    } else if (updateData.removeImage === "true") {
      // Handle image removal
      updateData.image = null;
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: leadObj,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating lead",
    });
  }
};

module.exports = {
  updateLead,
};
