const Lead = require('../../../models/file/sales/Lead');
const Deal = require('../../../models/file/sales/Deal');
const Account = require('../../../models/file/sales/Account');
const SalesOrder = require('../../../models/file/inventory/SalesOrder');
const Campaign = require('../../../models/file/sales/Campaign');
const Call = require('../../../models/file/activities/Call');
const Meeting = require('../../../models/file/activities/Meeting');
const Task = require('../../../models/file/activities/Task');
const mongoose = require('mongoose');

// Helper: Get start of month date
const getStartOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Helper: Get start of year date
const getStartOfYear = () => {
    const date = new Date();
    return new Date(date.getFullYear(), 0, 1);
};

// Helper: Get start of week date
const getStartOfWeek = () => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    date.setHours(0, 0, 0, 0);
    return date;
};

/**
 * GET /api/analytics/org-overview
 * Returns high-level metrics for the organization dashboard
 */
exports.getOrgOverview = async (req, res) => {
    try {
        const startOfMonth = getStartOfMonth();
        const startOfYear = getStartOfYear();

        // 1. Leads this month
        const leadsThisMonth = await Lead.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // 2. Revenue this month (Closed-Won Deals)
        // We sum the 'value' field for deals closed this month
        const revenueAggregation = await Deal.aggregate([
            {
                $match: {
                    stage: 'closed-won',
                    closeDate: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$value" }
                }
            }
        ]);
        const revenueThisMonth = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        // 3. Deals in Pipeline (Open deals i.e., not won or lost)
        const dealsInPipeline = await Deal.countDocuments({
            stage: {
                $nin: ['closed-won', 'closed-lost', 'closed-lost-to-competition']
            }
        });

        // 4. Accounts this month
        const accountsThisMonth = await Account.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // 5. Sales Performance (Last 3 Months)
        // Aggregating deals won per month for last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
        threeMonthsAgo.setDate(1); // Start of 3 months ago

        const performanceData = await Deal.aggregate([
            {
                $match: {
                    stage: 'closed-won',
                    closeDate: { $gte: threeMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$closeDate" },
                        year: { $year: "$closeDate" }
                    },
                    totalRevenue: { $sum: "$value" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({
            success: true,
            data: {
                leadsThisMonth,
                revenueThisMonth,
                dealsInPipeline,
                accountsThisMonth,
                performanceData
            }
        });

    } catch (error) {
        console.error('Error in getOrgOverview:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * GET /api/analytics/leads
 * Returns detailed lead analytics
 */
exports.getLeadAnalytics = async (req, res) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)

        // 1. Top Lead Sources
        const leadsBySource = await Lead.aggregate([
            { $group: { _id: "$leadSource", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 2. Leads This Week
        const leadsThisWeek = await Lead.countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        // 3. Lead Conversion Rate
        // (Converted Leads / Total Leads) * 100
        const totalLeads = await Lead.countDocuments();
        const convertedLeads = await Lead.countDocuments({ isConverted: true });
        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

        // 4. Leads by Industry
        const leadsByIndustry = await Lead.aggregate([
            { $group: { _id: "$industry", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                leadsBySource,
                leadsThisWeek,
                conversionRate,
                leadsByIndustry,
                totalLeads
            }
        });

    } catch (error) {
        console.error('Error in getLeadAnalytics:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * GET /api/analytics/deals
 * Returns detailed deal analytics
 */
exports.getDealInsights = async (req, res) => {
    try {
        // 1. Deals by Stage
        const dealsByStage = await Deal.aggregate([
            { $group: { _id: "$stage", count: { $sum: 1 }, totalValue: { $sum: "$value" } } }
        ]);

        // 2. Revenue by Owner
        const revenueByOwner = await Deal.aggregate([
            { $match: { stage: 'closed-won' } },
            { $group: { _id: "$owner", totalRevenue: { $sum: "$value" }, count: { $sum: 1 } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 }
        ]);

        // 3. Pipeline Health (Sum of open deals)
        const pipelineValueAggregation = await Deal.aggregate([
            {
                $match: {
                    stage: { $nin: ['closed-won', 'closed-lost', 'closed-lost-to-competition'] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPipelineValue: { $sum: "$value" },
                    count: { $sum: 1 }
                }
            }
        ]);
        const pipelineValue = pipelineValueAggregation.length > 0 ? pipelineValueAggregation[0].totalPipelineValue : 0;

        res.json({
            success: true,
            data: {
                dealsByStage,
                revenueByOwner,
                pipelineValue
            }
        });

    } catch (error) {
        console.error('Error in getDealInsights:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * GET /api/analytics/sales-trend
 * Returns sales trends based on Sales Orders
 */
exports.getSalesTrend = async (req, res) => {
    try {
        const startOfYear = getStartOfYear();

        // 1. Monthly Sales Trend (from Sales Orders)
        const monthlySales = await SalesOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear },
                    status: { $nin: ['Cancelled'] } // Exclude cancelled orders
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalSales: { $sum: "$grandTotal" }, // Using grandTotal from SalesOrder
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        // 2. Product Performance (Top Selling Products)
        // We need to unwind items array in SalesOrder
        const productPerformance = await SalesOrder.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productName",
                    totalRevenue: { $sum: "$items.amount" }, // items.amount is usually total for that line item
                    quantitySold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            success: true,
            data: {
                monthlySales,
                productPerformance
            }
        });

    } catch (error) {
        console.error('Error in getSalesTrend:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * GET /api/analytics/marketing
 * Returns analytics for marketing campaigns
 */
exports.getMarketingMetrics = async (req, res) => {
    try {
        const startOfQuarter = new Date();
        startOfQuarter.setMonth(Math.floor(startOfQuarter.getMonth() / 3) * 3);
        startOfQuarter.setDate(1);

        // 1. Total Campaigns (This Quarter)
        const totalCampaigns = await Campaign.countDocuments({
            createdAt: { $gte: startOfQuarter }
        });

        // 2. Campaign Performance Stats (Aggregated)
        const campaignStats = await Campaign.aggregate([
            {
                $group: {
                    _id: null,
                    totalBudget: { $sum: "$budgetedCost" },
                    totalActualCost: { $sum: "$actualCost" },
                    totalExpectedRevenue: { $sum: "$expectedRevenue" },
                    totalRevenue: { $sum: "$totalRevenue" }
                }
            }
        ]);
        const stats = campaignStats.length > 0 ? campaignStats[0] : { totalBudget: 0, totalActualCost: 0, totalExpectedRevenue: 0, totalRevenue: 0 };

        // 3. Campaigns by Type
        const campaignsByType = await Campaign.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 4. Top Campaigns by Revenue
        const topCampaignsByRevenue = await Campaign.find({ status: { $ne: 'Cancelled' } })
            .sort({ totalRevenue: -1 })
            .limit(5)
            .select('campaignName totalRevenue type status');

        // 5. Campaign Performance Table Data
        const campaignPerformance = await Campaign.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('campaignName actualCost totalRevenue status budgetedCost');

        // 6. Marketing ROI Metrics (Calculated)
        const totalInvestment = stats.totalActualCost || 1; // Avoid div by zero
        const totalReturn = stats.totalRevenue || 0;
        const roi = ((totalReturn - totalInvestment) / totalInvestment) * 100;

        res.json({
            success: true,
            data: {
                totalCampaigns,
                stats,
                campaignsByType,
                topCampaignsByRevenue,
                campaignPerformance,
                roi: roi.toFixed(2)
            }
        });

    } catch (error) {
        console.error('Error in getMarketingMetrics:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * GET /api/analytics/activity
 * Returns aggregated stats for activities (Calls, Meetings, Tasks)
 */
exports.getActivityStats = async (req, res) => {
    try {
        const startOfWeek = getStartOfWeek();

        // 1. Counts This Week
        const meetingsCount = await Meeting.countDocuments({ startTime: { $gte: startOfWeek } });
        const callsCount = await Call.countDocuments({ scheduledTime: { $gte: startOfWeek } });
        const tasksCount = await Task.countDocuments({ dueDate: { $gte: startOfWeek } });

        const totalActivities = meetingsCount + callsCount + tasksCount;

        // 2. Completion Rate (This Week)
        const completedMeetings = await Meeting.countDocuments({ startTime: { $gte: startOfWeek }, status: 'completed' });
        const completedCalls = await Call.countDocuments({ scheduledTime: { $gte: startOfWeek }, status: 'completed' });
        const completedTasks = await Task.countDocuments({ dueDate: { $gte: startOfWeek }, status: 'completed' });

        const totalCompleted = completedMeetings + completedCalls + completedTasks;
        const completionRate = totalActivities > 0 ? ((totalCompleted / totalActivities) * 100).toFixed(1) : 0;

        // 3. Activity Type Distribution
        const typeDistribution = [
            { type: 'Meetings', count: meetingsCount },
            { type: 'Calls', count: callsCount },
            { type: 'Tasks', count: tasksCount }
        ];

        // 4. Recent Activity Timeline (Merge and Sort)
        // Fetch last 5 of each to merge
        const recentMeetings = await Meeting.find().sort({ startTime: -1 }).limit(5).lean();
        const recentCalls = await Call.find().sort({ scheduledTime: -1 }).limit(5).lean();
        const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(5).lean(); // Tasks usually sorted by creation or due date

        const timeline = [
            ...recentMeetings.map(m => ({ ...m, type: 'meeting', time: m.startTime })),
            ...recentCalls.map(c => ({ ...c, type: 'call', time: c.scheduledTime })),
            ...recentTasks.map(t => ({ ...t, type: 'task', time: t.dueDate }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);


        res.json({
            success: true,
            data: {
                totalActivities,
                completionRate,
                typeDistribution,
                timeline,
                breakdown: {
                    meetings: meetingsCount,
                    calls: callsCount,
                    tasks: tasksCount
                }
            }
        });

    } catch (error) {
        console.error('Error in getActivityStats:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
