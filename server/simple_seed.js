const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const run = async () => {
    console.log('1. Starting...');
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI missing');
            process.exit(1);
        }

        console.log('2. Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('3. Connected.');

        console.log('4. Loading Campaign Model...');
        const Campaign = require('./models/file/sales/Campaign');

        const testCampaign = {
            campaignName: "Simple Test Campaign",
            type: "Email",
            status: "Active",
            campaignOwner: "System",
            createdBy: "System"
        };

        console.log('5. Inserting Campaign...');
        await Campaign.create(testCampaign);
        console.log('6. Campaign Inserted!');

        process.exit(0);
    } catch (e) {
        console.error('ERROR:', e);
        process.exit(1);
    }
};

run();
