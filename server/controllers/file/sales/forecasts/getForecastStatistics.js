const Deal = require('../../../../models/file/sales/Deal');
const Forecast = require('../../../../models/file/sales/Forecast');

const getForecastStatistics = async (req, res) => {
    try {
        const {
            period = 'quarterly',
            owner,
            team,
            stage,
            probability
        } = req.query;

        const currentUserId = req.user.id; // From auth middleware

        // 1. Determine Date Range
        const now = new Date();
        let startDate, endDate;

        switch (period) {
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of month
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'quarterly':
            default:
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
                break;
        }

        // 2. Build Query
        const query = {
            closeDate: { $gte: startDate, $lte: endDate }
        };

        if (owner && owner !== 'all') query.owner = owner;
        if (stage && stage !== 'all') query.stage = stage;

        // Probability filtering
        if (probability && probability !== 'all') {
            if (probability === 'high') query.probability = { $gte: 70 };
            else if (probability === 'medium') query.probability = { $gte: 30, $lt: 70 };
            else if (probability === 'low') query.probability = { $lt: 30 };
        }

        // 3. Fetch Deals
        const deals = await Deal.find(query);

        // 4. Calculate Statistics (Aggregations)
        // Initialize breakdown structures
        const ownerBreakdown = {};
        const stageBreakdown = {};
        const monthlyBreakdown = {};

        let totalPessimistic = 0;
        let totalRealistic = 0;
        let totalOptimistic = 0;
        let totalValue = 0;

        // Helper to init breakdown object
        const initBreakdownItem = () => ({
            deals: [],
            totalValue: 0,
            weightedValue: 0,
            dealCount: 0
        });

        deals.forEach(deal => {
            const val = deal.value || 0;
            const prob = deal.probability || 0;
            const weighted = (val * prob) / 100;

            // Totals
            totalOptimistic += val;
            if (prob >= 70) totalPessimistic += val;
            totalRealistic += weighted;
            totalValue += val;

            // By Owner
            const dealOwner = deal.owner || 'Unassigned';
            if (!ownerBreakdown[dealOwner]) ownerBreakdown[dealOwner] = initBreakdownItem();
            ownerBreakdown[dealOwner].deals.push(deal); // Note: Might want to limit this if too many deals
            ownerBreakdown[dealOwner].totalValue += val;
            ownerBreakdown[dealOwner].weightedValue += weighted;
            ownerBreakdown[dealOwner].dealCount += 1;

            // By Stage
            const dealStage = deal.stage || 'unknown';
            if (!stageBreakdown[dealStage]) stageBreakdown[dealStage] = initBreakdownItem();
            stageBreakdown[dealStage].deals.push(deal);
            stageBreakdown[dealStage].totalValue += val;
            stageBreakdown[dealStage].weightedValue += weighted;
            stageBreakdown[dealStage].dealCount += 1;

            // Monthly (for chart)
            const monthIndex = new Date(deal.closeDate).getMonth(); // 0-11
            if (!monthlyBreakdown[monthIndex]) {
                monthlyBreakdown[monthIndex] = {
                    month: new Date(deal.closeDate).toLocaleString('default', { month: 'short' }),
                    pessimistic: 0,
                    realistic: 0,
                    optimistic: 0,
                    dealCount: 0
                };
            }
            monthlyBreakdown[monthIndex].optimistic += val;
            if (prob >= 70) monthlyBreakdown[monthIndex].pessimistic += val;
            monthlyBreakdown[monthIndex].realistic += weighted;
            monthlyBreakdown[monthIndex].dealCount += 1;
        });

        // 5. Fetch User Quota for comparison (Optional: could drive progress bars)
        const userForecast = await Forecast.findOne({ user: currentUserId });
        // Get unique owners and stages for filter options
        const uniqueOwners = [...new Set(deals.map(d => d.owner).filter(Boolean))];
        const uniqueStages = [...new Set(deals.map(d => d.stage).filter(Boolean))];

        const quota = userForecast?.quotas?.[period] || 0;

        res.status(200).json({
            period: {
                start: startDate,
                end: endDate,
                type: period
            },
            totals: {
                pessimistic: totalPessimistic,
                realistic: totalRealistic,
                optimistic: totalOptimistic,
                totalDeals: deals.length,
                totalValue: totalValue,
                quota: quota
            },
            breakdown: {
                byOwner: ownerBreakdown,
                byStage: stageBreakdown,
                monthly: monthlyBreakdown
            },
            deals: deals, // Return deals for the 'Details' tab or specific list views
            filterOptions: {
                owners: uniqueOwners,
                stages: uniqueStages
            }
        });

    } catch (error) {
        console.error('Get Forecast Statistics Error:', error);
        res.status(500).json({ message: 'Error fetching forecast statistics', error: error.message });
    }
};

module.exports = getForecastStatistics;
