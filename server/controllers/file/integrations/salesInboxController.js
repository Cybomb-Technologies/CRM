const Email = require("../../../models/file/integrations/Email");
const ConnectedAccount = require("../../../models/file/integrations/ConnectedAccount");
const nodemailer = require("nodemailer");
const imaps = require("imap-simple");
const dns = require('dns'); // Added for debugging
const { simpleParser } = require("mailparser");
const Lead = require("../../../models/file/sales/Lead");
const Contact = require("../../../models/file/sales/Contact");
const Deal = require("../../../models/file/sales/Deal");

// --- Helper: Create Transporter ---
const createTransporter = (account) => {
  // For now, handling generic SMTP. In future, handle specific providers (Gmail OAuth, etc.)
  // Assuming the credentials object has the necessary info.

  // For Gmail/Outlook with App Password, we use standard SMTP
  // host: smtp.gmail.com / smtp.office365.com

  if (!account.credentials || !account.credentials.user) {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "test@ethereal.email",
        pass: "test",
      },
    });
  }

  return nodemailer.createTransport({
    host: account.credentials.smtpHost || "smtp.gmail.com",
    port: account.credentials.smtpPort || 465,
    secure:
      account.credentials.smtpSecure !== undefined
        ? account.credentials.smtpSecure
        : true, // Default to SSL for 465
    auth: {
      user: account.credentials.user,
      pass: account.credentials.pass,
    },
    tls: {
        rejectUnauthorized: false
    }
  });
};

// --- Helper: Verify Connection Only ---
const verifyAccountConnection = async (account) => {
    if (!account.credentials || !account.credentials.user) return;

    const config = {
        imap: {
            user: account.credentials.user,
            password: account.credentials.pass,
            host: account.credentials.imapHost || "imap.gmail.com",
            port: account.credentials.imapPort || 993,
            tls: (account.credentials.imapPort === 993) || (account.credentials.imapTls !== undefined ? account.credentials.imapTls : true),
            tlsOptions: { rejectUnauthorized: false }, 
            authTimeout: 10000,
        },
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox("INBOX");
        console.log(`✅ Connection Verified for ${account.email}`);
        connection.end();
        return true;
    } catch (err) {
        console.error("Connection Verification Failed:", err);
        throw err;
    }
};

// --- Helper: Sync Emails via IMAP ---
const syncAccountEmails = async (account) => {
  if (!account.credentials || !account.credentials.user) return;

  const config = {
    imap: {
      user: account.credentials.user,
      password: account.credentials.pass,
      host: account.credentials.imapHost || "imap.gmail.com",
      port: account.credentials.imapPort || 993,
      tls: (account.credentials.imapPort === 993) || (account.credentials.imapTls !== undefined ? account.credentials.imapTls : true),
      tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certs
      authTimeout: 15000,
      debug: (msg) => {
          console.log(msg); // Keep console
          require('fs').appendFileSync('imap-debug.log', `[${new Date().toISOString()}] ${msg}\n`);
      },
    },
  };

  try {
    const connection = await imaps.connect(config);

    // Prevent crash on protocol errors
    connection.imap.on('error', function(err) {
        console.error("IMAP Protocol Error (caught):", err);
    });

    await connection.openBox("INBOX");

    // Fetch unseen messages or last 20 messages
    // 1. RAW SEARCH: Get UIDs only (safest operation)
    // We use the underlying node-imap object directly to avoid imap-simple's auto-fetch
    const uids = await new Promise((resolve, reject) => {
        connection.imap.search(['UNSEEN'], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });

    console.log(`Found ${uids.length} unseen emails locally.`);

    let messagesToProcessIDs = uids;
    if (uids.length === 0) {
        // Fallback to last 10 if empty
         const allUids = await new Promise((resolve, reject) => {
            connection.imap.search(['ALL'], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        messagesToProcessIDs = allUids.slice(-10);
    }

    // 2. Process each UID individually
    for (const uid of messagesToProcessIDs) {
       try {
          // Check locally first
          const existing = await Email.findOne({
            messageId: uid + "@" + account._id,
          }); 
          
          if (existing) continue;

          // 3. Helper to fetch single message Body safely
          const fetchMessage = () => new Promise((resolve, reject) => {
              try {
                  const f = connection.imap.fetch(uid, {
                      bodies: ['HEADER', 'TEXT', ''],
                      struct: false, // DISABLE struct again - caused parser crash
                      markSeen: false
                  });
                  
                  let fullBody = "";
                  let attributes = {};
                  
                  f.on('message', function(msg, seqno) {
                      msg.on('body', function(stream, info) {
                          let buffer = '';
                          stream.on('data', function(chunk) {
                              buffer += chunk.toString('utf8');
                          });
                          stream.once('end', function() {
                              fullBody += buffer;
                          });
                      });
                      msg.once('attributes', function(attrs) {
                          attributes = attrs;
                      });
                  });
                  
                  f.once('error', function(err) {
                      reject(err);
                  });
                  
                  f.once('end', function() {
                      resolve({ fullBody, attributes });
                  });
              } catch (ex) { reject(ex); }
          });

          // Fetch with timeout/protection
          const { fullBody, attributes } = await fetchMessage();

          if (!fullBody) continue;

          const parsed = await simpleParser(fullBody);

          // Duplicate check using standard Message-ID header (double check)
          const messageId = parsed.messageId || uid + "@" + account._id;
          const existsDouble = await Email.findOne({ messageId: messageId });
          if (existsDouble) continue;

          // Smart View Matching logic
          let relatedTo = { type: "none" };
          const fromEmail = parsed.from && parsed.from.value && parsed.from.value[0] ? parsed.from.value[0].address : "";

          if (fromEmail) {
              // Check Leads
              const lead = await Lead.findOne({ email: fromEmail });
              if (lead) {
                relatedTo = {
                  type: "lead",
                  id: lead._id,
                  name: lead.firstName + " " + lead.lastName,
                };
              } else {
                // Check Contacts
                const contact = await Contact.findOne({ email: fromEmail });
                if (contact) {
                  relatedTo = {
                    type: "contact",
                    id: contact._id,
                    name: contact.firstName + " " + contact.lastName,
                  };
                }
              }
          }

          const newEmail = new Email({
            userId: account.userId, 
            connectedAccountId: account._id,
            messageId: messageId,
            from: {
              name: parsed.from && parsed.from.value && parsed.from.value[0] ? parsed.from.value[0].name : fromEmail,
              email: fromEmail,
            },
            to: parsed.to && parsed.to.value ? parsed.to.value.map((t) => ({ name: t.name, email: t.address })) : [],
            subject: parsed.subject || "(No Subject)",
            snippet: parsed.text ? parsed.text.substring(0, 100) : "",
            body: parsed.html || parsed.textAsHtml || parsed.text || "",
            date: parsed.date || new Date(),
            folder: "inbox",
            read: false, 
            relatedTo,
            hasAttachment: parsed.attachments && parsed.attachments.length > 0,
            attachments: parsed.attachments ? parsed.attachments.map((att) => ({
              filename: att.filename,
              contentType: att.contentType,
              size: att.size,
            })) : [],
          });

          try {
               await newEmail.save();
          } catch (saveErr) {
               if (saveErr.code === 11000) {
                   // Duplicate key error, ignore
               } else {
                   console.error("Error saving email:", saveErr);
               }
          }
       } catch (msgErr) {
           console.error(`Skipping malformed message UID ${uid}:`, msgErr.message);
           // Continue to next message
       }
    }

    connection.end();
    console.log(
      `Synced ${messagesToProcessIDs.length} emails for ${account.email}`
    );
  } catch (err) {
    console.error("IMAP Sync Error:", err);
    throw err; // Re-throw for connection verification usage
  }
};
// lodash _ helper for imap-simple if needed, but imap-simple usually returns array
const _ = require("lodash"); // Add lodash if not present, or use Array.find

// --- Email Controller Methods ---

// Get all emails (with optional filtering)
exports.getEmails = async (req, res) => {
  try {
    const { folder, read, important, limit, page, refresh } = req.query;

    console.log(`Getting emails... Folder: ${folder}, Refresh: ${refresh}`);

    const executeSync = async () => {
        console.log("Starting Sync...");
        const accounts = await ConnectedAccount.find();
        console.log(`Found ${accounts.length} accounts to sync.`);
        for (const account of accounts) {
            try {
               await syncAccountEmails(account);
            } catch (e) { console.error("Sync failed for", account.email, e.message); }
        }
    };

    // Trigger Sync if requested 
    if (refresh === 'true') {
        await executeSync();
    }

    const query = {};

    if (folder) query.folder = folder;
    if (read !== undefined) query.read = read === 'true';
    if (important !== undefined) query.important = important === 'true';

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Check total before fetching
    const total = await Email.countDocuments(query);
    
    // Auto-sync if inbox is empty and no specific filters (except folder=inbox or none)
    // and we haven't just synced (refresh != true)
    if (total === 0 && (!folder || folder === 'inbox') && refresh !== 'true') {
         const accountCount = await ConnectedAccount.countDocuments();
         if (accountCount > 0) {
             console.log("Inbox empty, triggering auto-sync...");
             await executeSync();
             // Recount after sync
             // Note: effectively we just continue to fetch below, which will pick up new emails
         }
    }

    const emails = await Email.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const finalTotal = await Email.countDocuments(query);

    res.json({
      success: true,
      data: emails,
      pagination: {
        total: finalTotal,
        page: pageNum,
        pages: Math.ceil(finalTotal / limitNum)
      }
    });
  } catch (err) {
    console.error("Get Emails Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single email
exports.getEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
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
      inbox: await Email.countDocuments({ folder: "inbox" }),
      unread: await Email.countDocuments({ read: false }), // Assuming global unread
      important: await Email.countDocuments({ important: true }),
      sent: await Email.countDocuments({ folder: "sent" }),
      drafts: await Email.countDocuments({ folder: "drafts" }),
      archive: await Email.countDocuments({ folder: "archive" }),
      leads: await Email.countDocuments({ "relatedTo.type": "lead" }),
      deals: await Email.countDocuments({ "relatedTo.type": "deal" }),
      priority: await Email.countDocuments({ important: true }), // Using important as proxy for priority
    };
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Send Email
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body, connectedAccountId } = req.body;

    if (!connectedAccountId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No connected account selected for sending.",
        });
    }

    const account = await ConnectedAccount.findById(connectedAccountId);
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    const transporter = createTransporter(account);

    const info = await transporter.sendMail({
      from: `"${account.email}" <${account.email}>`,
      to: to,
      subject: subject,
      text: body, // plain text body
      html: `<div>${body.replace(/\n/g, "<br>")}</div>`, // simple html body
    });

    // Save to sent folder
    const newEmail = new Email({
      connectedAccountId,
      from: {
        email: account.email,
        name: "Me",
      },
      to: typeof to === "string" ? [{ email: to }] : to,
      subject,
      body,
      snippet: body.substring(0, 100),
      folder: "sent",
      read: true,
      messageId: info.messageId,
      date: new Date(),
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
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Connected Account Controller Methods ---

exports.getConnectedAccounts = async (req, res) => {
  try {
    const accounts = await ConnectedAccount.find().select("-credentials"); // Exclude sensitive data
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addConnectedAccount = async (req, res) => {
  try {
    const { email, provider, credentials } = req.body;

    // Check if valid provider
    if (!["gmail", "outlook", "imap"].includes(provider)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid provider" });
    }

    // Prepare credentials for IMAP/SMTP
    // credentials: { user, pass, imapHost, imapPort, smtpHost, smtpPort }
    // For Gmail/Outlook, we can pre-set hosts if not provided

    let processedCredentials = { ...credentials };
    if (provider === "gmail") {
      processedCredentials.imapHost = "imap.gmail.com";
      processedCredentials.imapPort = 993;
      processedCredentials.imapTls = true; // FORCE TLS
      processedCredentials.smtpHost = "smtp.gmail.com";
      processedCredentials.smtpPort = 465;
      processedCredentials.smtpSecure = true;
    } else if (provider === "outlook") {
      processedCredentials.imapHost = "outlook.office365.com";
      processedCredentials.imapPort = 993;
      processedCredentials.imapTls = true; // FORCE TLS
      processedCredentials.smtpHost = "smtp.office365.com";
      processedCredentials.smtpPort = 587; // or 25, 587 is STARTTLS
      processedCredentials.smtpSecure = false; // STARTTLS
    }

    const tempAccount = {
      email,
      credentials: processedCredentials,
    };

    // Verify Connection via IMAP
    console.log(`Verifying connection for ${email}...`);

    // Explicit DNS Check to debug ENOTFOUND
    const hostToCheck = processedCredentials.imapHost;
    if (hostToCheck) {
        console.log(`Performing DNS lookup for: ${hostToCheck}`);
        try {
            await new Promise((resolve, reject) => {
                dns.lookup(hostToCheck, (err, address, family) => {
                    if (err) reject(err);
                    else {
                        console.log(`✅ DNS Resolved: ${hostToCheck} -> ${address} (Family: ${family})`);
                        resolve(address);
                    }
                });
            });
        } catch (dnsErr) {
            console.error("❌ DNS Lookup Failed inside Controller:", dnsErr);
            return res.status(400).json({
                success: false,
                message: `DNS Resolution failed for ${hostToCheck}.`,
                details: `System could not resolve address: ${dnsErr.message}`
            });
        }
    }

    // Verify Connection via IMAP (Lightweight)
    console.log(`Verifying connection for ${email} (Lightweight)...`);

    try {
      await verifyAccountConnection({ _id: "temp", ...tempAccount }); 
    } catch (connectionError) {
      console.error("Connection Failed:", connectionError);
      return res.status(400).json({
        success: false,
        message: "Connection failed. Please check your email and app password.",
        details: connectionError.message,
      });
    }

    const newAccount = new ConnectedAccount({
      email,
      provider,
      credentials: processedCredentials,
      status: "connected",
      lastSync: new Date(),
    });

    await newAccount.save();

    // Trigger actual sync after save
    syncAccountEmails(newAccount).catch((err) =>
      console.error("Background sync error", err)
    );

    res.status(201).json({ success: true, data: newAccount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeConnectedAccount = async (req, res) => {
  try {
    await ConnectedAccount.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Account removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.debugSync = async (req, res) => {
    try {
        const accounts = await ConnectedAccount.find();
        const results = [];
        for (const account of accounts) {
            try {
                // Capture console log or return status
                await syncAccountEmails(account);
                results.push({ email: account.email, status: 'Success' });
            } catch (e) {
                results.push({ email: account.email, status: 'Failed', error: e.message, stack: e.stack });
            }
        }
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
