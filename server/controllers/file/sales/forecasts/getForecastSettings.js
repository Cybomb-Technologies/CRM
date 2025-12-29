const Forecast = require('../../../../models/file/sales/Forecast');

const getForecastSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        let forecast = await Forecast.findOne({ user: userId });

        if (!forecast) {
            // Create default if not exists
            forecast = await Forecast.create({ user: userId });
        }

        res.status(200).json(forecast);
    } catch (error) {
        console.error('Get Forecast Settings Error:', error);
        res.status(500).json({ message: 'Error fetching forecast settings', error: error.message });
    }
};

module.exports = getForecastSettings;
