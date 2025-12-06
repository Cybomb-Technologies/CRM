// server/controllers/file/sales/leads/createLead.js
const Lead = require("../../../../models/file/sales/Lead");
const fs = require("fs");

// Create new lead
const createLead = async (req, res) => {
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

    // Parse lead data from request body or from data field (for FormData)
    let leadData = {};

    if (req.body.data) {
      // If data is sent as JSON string (FormData case)
      try {
        leadData = JSON.parse(req.body.data);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        leadData = req.body;
      }
    } else {
      // Regular JSON request
      leadData = req.body;
    }

    // Ensure required fields are present and set defaults
    const finalLeadData = {
      ...leadData,
      leadOwner: leadData.leadOwner || "System",
      createdBy: "System",
    };

    // Add image data if uploaded
    if (imageData) {
      finalLeadData.image = imageData;
    }

    // Validate required fields
    if (!finalLeadData.company || !finalLeadData.lastName) {
      return res.status(400).json({
        success: false,
        message: "Company and Last Name are required fields",
      });
    }

    const lead = new Lead(finalLeadData);
    await lead.save();

    // Convert image for response
    const leadObj = lead.toObject();
    if (leadObj.image && leadObj.image.data) {
      leadObj.imageUrl = `data:${
        leadObj.image.contentType
      };base64,${leadObj.image.data.toString("base64")}`;
    }

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: leadObj,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating lead",
    });
  }
};

module.exports = {
  createLead,
};
