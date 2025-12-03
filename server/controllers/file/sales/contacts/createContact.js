const Contact = require("../../../../models/file/sales/Contact");

const createContact = async (req, res) => {
  console.log("📥 Create contact request received");

  try {
    const {
      firstName,
      lastName,
      accountId,
      accountName,
      title,
      department,
      email,
      phone,
      mobile,
      assistant,
      assistantPhone,
      leadSource,
      reportsTo,
      emailOptOut,
      mailingAddress,
      otherAddress,
      description,
      convertedFromLead,
    } = req.body;

    console.log("🔍 Validating data:", { firstName, lastName });

    // Validate required fields
    if (!firstName || !lastName) {
      console.log("❌ Validation failed: Missing firstName or lastName");
      return res.status(400).json({
        success: false,
        message: "First name and last name are required fields",
      });
    }

    console.log("✅ Validation passed");

    const contactData = {
      firstName: firstName?.trim() || "",
      lastName: lastName?.trim() || "",
      accountId: accountId || undefined,
      accountName: accountName || "",
      title: title || "",
      department: department || "None",
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      mobile: mobile?.trim() || "",
      assistant: assistant?.trim() || "",
      assistantPhone: assistantPhone?.trim() || "",
      leadSource: leadSource || "None",
      reportsTo: reportsTo || "",
      emailOptOut: emailOptOut || false,
      mailingAddress: mailingAddress || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      otherAddress: otherAddress || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      description: description || "",
      convertedFromLead: convertedFromLead || undefined,
      createdBy: req.user ? req.user.id : undefined,
    };

    console.log("💾 Creating contact with data:", contactData);

    const contact = new Contact(contactData);
    await contact.save();

    console.log("✅ Contact saved successfully:", contact._id);

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    console.error("🔥 Create contact error:", {
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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A contact with this email already exists",
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: "Failed to create contact",
      error: error.message,
    });
  }
};

module.exports = createContact;
