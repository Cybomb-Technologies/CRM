const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const result = dotenv.config();
if (result.error) console.error(result.error);

// Use MONGODB_URI as per .env
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

// Load Models
const Campaign = require('./models/file/sales/Campaign');
const Call = require('./models/file/activities/Call');
const Meeting = require('./models/file/activities/Meeting');
const Task = require('./models/file/activities/Task');

// Sample Data
const campaigns = [
    {
        campaignName: "Q1 Product Launch",
        type: "Email",
        status: "Active",
        budgetedCost: 5000,
        actualCost: 1200,
        expectedRevenue: 20000,
        totalRevenue: 5000,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        campaignOwner: "Admin User",
        createdBy: "Admin User"
    },
    {
        campaignName: "Tech Conference 2024",
        type: "Conference",
        status: "Completed",
        budgetedCost: 15000,
        actualCost: 14500,
        expectedRevenue: 50000,
        totalRevenue: 65000,
        startDate: new Date(new Date().setDate(new Date().getDate() - 60)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 55)),
        campaignOwner: "Admin User",
        createdBy: "Admin User"
    },
    {
        campaignName: "Summer Webinar",
        type: "Webinar",
        status: "Planning",
        budgetedCost: 2000,
        actualCost: 0,
        expectedRevenue: 10000,
        totalRevenue: 0,
        startDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 45)),
        campaignOwner: "Admin User",
        createdBy: "Admin User"
    }
];

const commonFields = {
    createdBy: "Admin User",
    assignedTo: "Admin User",
    relatedTo: {
        type: "lead",
        // Using a dummy ID format that looks like Mongo ObjectId to be safe, though string type allows any.
        // But better to use a 24 char hex string if validation is strict.
        id: "507f1f77bcf86cd799439011",
        name: "Test Lead"
    }
};

const activities = {
    calls: [
        {
            title: "Intro Call",
            type: "Call",
            callType: "outbound",
            status: "completed",
            scheduledTime: new Date(),
            duration: 30,
            description: "Initial discussion",
            outcome: "Connected",
            phoneNumber: "123-456-7890",
            ...commonFields
        },
        {
            title: "Follow up",
            type: "Call",
            callType: "outbound",
            status: "scheduled",
            scheduledTime: new Date(new Date().setDate(new Date().getDate() + 1)),
            duration: 15,
            description: "Follow up call",
            phoneNumber: "123-456-7890",
            ...commonFields
        }
    ],
    meetings: [
        {
            title: "Demo Meeting",
            type: "Meeting",
            status: "completed",
            startTime: new Date(new Date().setHours(10, 0, 0, 0)),
            endTime: new Date(new Date().setHours(11, 0, 0, 0)),
            location: "Zoom",
            hostName: "Admin User",
            venueType: "online",
            ...commonFields
        },
        {
            title: "Strategy Sync",
            type: "Meeting",
            status: "scheduled",
            startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
            endTime: new Date(new Date().setDate(new Date().getDate() + 2)),
            location: "Office",
            hostName: "Admin User",
            venueType: "in-office",
            ...commonFields
        }
    ],
    tasks: [
        {
            title: "Send Proposal",
            type: "Task",
            status: "in-progress",
            priority: "medium",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
            ...commonFields
        },
        {
            title: "Update CRM",
            type: "Task",
            status: "completed",
            priority: "low",
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            ...commonFields
        }
    ]
};

const seedData = async () => {
    try {
        if (!mongoUri) {
            throw new Error('MONGODB_URI (and MONGO_URI) is undefined');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected');

        // Helper to insert
        const insert = async (Model, data, name) => {
            try {
                // await Model.deleteMany({}); // Uncomment to clear existing
                await Model.insertMany(data);
                console.log(`✅ Inserted ${data.length} ${name}`);
            } catch (e) {
                console.error(`❌ Error inserting ${name}:`);
                if (e.name === 'ValidationError') {
                    for (let field in e.errors) {
                        console.error(`  - ${e.errors[field].message}`);
                    }
                } else {
                    console.error(e.message);
                }
            }
        }

        await insert(Campaign, campaigns, 'Campaigns');
        await insert(Call, activities.calls, 'Calls');
        await insert(Meeting, activities.meetings, 'Meetings');
        await insert(Task, activities.tasks, 'Tasks');

        console.log('\n🎉 Data Seeding Completed!');
        process.exit(0);

    } catch (e) {
        console.error('Fatal Error:', e);
        process.exit(1);
    }
};

seedData();
