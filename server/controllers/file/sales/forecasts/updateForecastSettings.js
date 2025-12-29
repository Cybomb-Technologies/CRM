const Forecast = require('../../../../models/file/sales/Forecast');

const updateForecastSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quotas, settings } = req.body;

        let forecast = await Forecast.findOne({ user: userId });

        if (!forecast) {
            forecast = new Forecast({ user: userId });
        }

        if (quotas) forecast.quotas = { ...forecast.quotas, ...quotas };
        if (settings) forecast.settings = { ...forecast.settings, ...settings };

        forecast.updatedAt = Date.now();
        await forecast.save();

        res.status(200).json(forecast);
    } catch (error) {
        console.error('Update Forecast Settings Error:', error);
        res.status(500).json({ message: 'Error updating forecast settings', error: error.message });
    }
};

module.exports = updateForecastSettings;
