const getForecastStatistics = require('./getForecastStatistics');
const getForecastSettings = require('./getForecastSettings');
const updateForecastSettings = require('./updateForecastSettings');

module.exports = {
    getStats: getForecastStatistics,
    getSettings: getForecastSettings,
    updateSettings: updateForecastSettings
};
