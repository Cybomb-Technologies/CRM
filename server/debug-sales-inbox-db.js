const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Email = require('./models/file/integrations/Email');
const ConnectedAccount = require('./models/file/integrations/ConnectedAccount');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    const accounts = await ConnectedAccount.find();
    console.log('Accounts:', JSON.stringify(accounts, null, 2));
    
    const emailCount = await Email.countDocuments();
    console.log('Total Emails:', emailCount);
    
    if (emailCount > 0) {
        const emails = await Email.find().limit(5);
        console.log('Sample Emails:', JSON.stringify(emails, null, 2));
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
