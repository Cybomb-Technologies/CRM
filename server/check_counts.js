const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Load Models
        const Campaign = require('./models/file/sales/Campaign');
        const Call = require('./models/file/activities/Call');
        const Meeting = require('./models/file/activities/Meeting');
        const Task = require('./models/file/activities/Task');

        const campaignCount = await Campaign.countDocuments();
        const callCount = await Call.countDocuments();
        const meetingCount = await Meeting.countDocuments();
        const taskCount = await Task.countDocuments();

        console.log('--- Database Counts ---');
        console.log(`Campaigns: ${campaignCount}`);
        console.log(`Calls: ${callCount}`);
        console.log(`Meetings: ${meetingCount}`);
        console.log(`Tasks: ${taskCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
