const { API } = require('homebridge');

const { GreeAC } = require('gree-hvac-client');
const { PROPERTY_VALUE } = require('./property-value');

class HomebridgePlugin {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.greeAC = new GreeAC();

    this.api.on('didFinishLaunching', () => {
      this.log('Plugin finished launching');
      this.initializeAccessories();
    });
  }

  initializeAccessories() {
    const accessories = this.config.accessories || [];

    for (const accessoryConfig of accessories) {
      const accessory = this.createAccessory(accessoryConfig);
      this.api.registerPlatformAccessories('homebridge-plugin', 'GreeACPlatform', [accessory]);
    }
  }

  createAccessory(accessoryConfig) {
    const accessory = new this.api.platformAccessory(accessoryConfig.name, accessoryConfig.uuid);

    accessory.addService(this.api.hap.Service.Thermostat, accessoryConfig.name);

    // Add more services and characteristics based on your requirements

    accessory.context.deviceId = accessoryConfig.deviceId;

    this.configureAccessory(accessory);

    return accessory;
  }

  configureAccessory(accessory) {
    const service = accessory.getService(this.api.hap.Service.Thermostat);

    const characteristicOn = service.getCharacteristic(this.api.hap.Characteristic.On);
    characteristicOn.onSet(async (value) => {
      await this.setPowerState(accessory.context.deviceId, value);
    });

    const characteristicTemperature = service.getCharacteristic(this.api.hap.Characteristic.TargetTemperature);
    characteristicTemperature.onSet(async (value) => {
      await this.setTemperature(accessory.context.deviceId, value);
    });

    // Add event handlers for other characteristics as needed

    this.updateAccessoryStatus(accessory);
  }

  async setPowerState(deviceId, powerState) {
    const value = powerState ? PROPERTY_VALUE.power.on : PROPERTY_VALUE.power.off;
    await this.greeAC.sendCommand(deviceId, 'power', value);
  }

  async setTemperature(deviceId, temperature) {
    await this.greeAC.sendCommand(deviceId, 'temperature', temperature);
  }

  // Implement other device control methods as needed

  async updateAccessoryStatus(accessory) {
    const deviceId = accessory.context.deviceId;

    try {
      const deviceStatus = await this.greeAC.getDeviceStatus(deviceId);

      const service = accessory.getService(this.api.hap.Service.Thermostat);
      const characteristicOn = service.getCharacteristic(this.api.hap.Characteristic.On);
      const characteristicTemperature = service.getCharacteristic(this.api.hap.Characteristic.TargetTemperature);

      // Update characteristic values based on the device status

      characteristicOn.updateValue(deviceStatus.power === PROPERTY_VALUE.power.on);
      characteristicTemperature.updateValue(deviceStatus.temperature);

      // Update other characteristics based on the device status

    } catch (error) {
      this.log(`Failed to update accessory status: ${error}`);
    }
  }
}

module.exports = (api) => {
  API.registerPlatform('GreeACPlatform', HomebridgePlugin);
};
