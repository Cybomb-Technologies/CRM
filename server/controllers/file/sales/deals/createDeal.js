const Deal = require("../../../../models/file/sales/Deal");

const createDeal = async (req, res) => {
  console.log("📥 Create deal request received");

  try {
    const {
      title,
      company,
      contactId,
      contactName,
      accountId,
      accountName,
      value,
      probability,
      stage,
      closeDate,
      owner,
      description,
      leadSource,
      industry,
      tags,
      sourceLeadId,
    } = req.body;

    console.log("🔍 Validating data:", { title, company });

    // Validate required fields
    if (!title) {
      console.log("❌ Validation failed: Missing title");
      return res.status(400).json({
        success: false,
        message: "Deal title is required",
      });
    }

    if (!company) {
      console.log("❌ Validation failed: Missing company");
      return res.status(400).json({
        success: false,
        message: "Company is required",
      });
    }

    console.log("✅ Validation passed");

    const dealData = {
      title: title?.trim() || "",
      company: company?.trim() || "",
      contactId: contactId || undefined,
      contactName: contactName?.trim() || "",
      accountId: accountId || undefined,
      accountName: accountName?.trim() || "",
      value: parseFloat(value) || 0,
      probability: Math.min(100, Math.max(0, parseInt(probability) || 0)),
      stage: stage || "qualification",
      closeDate: closeDate ? new Date(closeDate) : new Date(),
      owner: owner?.trim() || "Unassigned",
      description: description?.trim() || "",
      leadSource: leadSource || "",
      industry: industry || "",
      tags: Array.isArray(tags) ? tags : [],
      sourceLeadId: sourceLeadId || undefined,
      createdBy: req.user ? req.user.id : undefined,
    };

    console.log("💾 Creating deal with data:", dealData);

    const deal = new Deal(dealData);
    await deal.save();

    console.log("✅ Deal saved successfully:", deal._id);

    res.status(201).json({
      success: true,
      message: "Deal created successfully",
      deal,
    });
  } catch (error) {
    console.error("🔥 Create deal error:", {
      name: error.name,
      message: error.message,
    });

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      console.log("📝 Validation errors:", messages);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: "Failed to create deal",
      error: error.message,
    });
  }
};

module.exports = createDeal;
