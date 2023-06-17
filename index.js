const { HomebridgePlugin } = require('./src/homebridge-plugin');

module.exports = (api) => {
  api.registerPlatform('GreeAirConditioner', 'GreeAirConditioner', HomebridgePlugin);
};
