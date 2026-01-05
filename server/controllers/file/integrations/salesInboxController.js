const Email = require('../../../models/file/integrations/Email');
const ConnectedAccount = require('../../../models/file/integrations/ConnectedAccount');
const nodemailer = require('nodemailer');

// --- Helper: Create Transporter ---
const createTransporter = (account) => {
    // For now, handling generic SMTP. In future, handle specific providers (Gmail OAuth, etc.)
    // Assuming the credentials object has the necessary info.
    // Falls back to Ethereal if no credentials for testing.
    
    if (!account.credentials || !account.credentials.user) {
        // Fallback for demo/testing without real credentials
         return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: "test@ethereal.email",
                pass: "test"
            }
        });
    }

    return nodemailer.createTransport({
        host: account.credentials.host || 'smtp.gmail.com', // Default to gmail for simple input
        port: account.credentials.port || 587,
        secure: account.credentials.secure || false,
        auth: {
            user: account.credentials.user,
            pass: account.credentials.pass
        }
    });
};

// --- Email Controller Methods ---

// Get all emails (with optional filtering)
exports.getEmails = async (req, res) => {
  try {
    const { folder, read, important, limit, page } = req.query;
    const query = {};

    if (folder) query.folder = folder;
    if (read !== undefined) query.read = read === 'true';
    if (important !== undefined) query.important = important === 'true';

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    const emails = await Email.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Email.countDocuments(query);

    res.json({
      success: true,
      data: emails,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single email
exports.getEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Email Stats (Counts for folders)
exports.getEmailStats = async (req, res) => {
    try {
        const stats = {
            inbox: await Email.countDocuments({ folder: 'inbox' }),
            unread: await Email.countDocuments({ read: false }), // Assuming global unread
            important: await Email.countDocuments({ important: true }),
            sent: await Email.countDocuments({ folder: 'sent' }),
            drafts: await Email.countDocuments({ folder: 'drafts' }),
            archive: await Email.countDocuments({ folder: 'archive' }),
            leads: await Email.countDocuments({ 'relatedTo.type': 'lead' }),
            deals: await Email.countDocuments({ 'relatedTo.type': 'deal' }),
            priority: await Email.countDocuments({ important: true }) // Using important as proxy for priority
        };
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Send Email
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body, connectedAccountId } = req.body;

    if (!connectedAccountId) {
        return res.status(400).json({ success: false, message: 'No connected account selected for sending.' });
    }

    const account = await ConnectedAccount.findById(connectedAccountId);
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' });

    const transporter = createTransporter(account);

    const info = await transporter.sendMail({
        from: `"${account.email}" <${account.email}>`,
        to: to,
        subject: subject,
        text: body, // plain text body
        html: `<div>${body.replace(/\n/g, '<br>')}</div>` // simple html body
    });

    // Save to sent folder
    const newEmail = new Email({
      connectedAccountId,
      from: {
        email: account.email,
        name: 'Me'
      },
      to: typeof to === 'string' ? [{ email: to }] : to,
      subject,
      body,
      snippet: body.substring(0, 100),
      folder: 'sent',
      read: true,
      messageId: info.messageId,
      date: new Date()
    });

    await newEmail.save();

    res.status(201).json({ success: true, data: newEmail });
  } catch (err) {
    console.error("Send Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update email (mark read, move folder, etc.)
exports.updateEmail = async (req, res) => {
  try {
    const { read, important, folder, labels } = req.body;
    const updateData = {};
    
    if (read !== undefined) updateData.read = read;
    if (important !== undefined) updateData.important = important;
    if (folder !== undefined) updateData.folder = folder;
    if (labels !== undefined) updateData.labels = labels;

    const email = await Email.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' }); 
    }

    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// --- Connected Account Controller Methods ---

exports.getConnectedAccounts = async (req, res) => {
  try {
    const accounts = await ConnectedAccount.find().select('-credentials'); // Exclude sensitive data
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addConnectedAccount = async (req, res) => {
  try {
    const { email, provider, credentials } = req.body;
    
    // Check if valid provider (mock check)
    if (!['gmail', 'outlook', 'smtp'].includes(provider)) {
      return res.status(400).json({ success: false, message: 'Invalid provider' });
    }

    const newAccount = new ConnectedAccount({
      email,
      provider,
      credentials, 
      status: 'connected',
      lastSync: new Date()
    });

    await newAccount.save();
    
    // Removed Mock Email Seeding

    res.status(201).json({ success: true, data: newAccount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeConnectedAccount = async (req, res) => {
  try {
    await ConnectedAccount.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Account removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
