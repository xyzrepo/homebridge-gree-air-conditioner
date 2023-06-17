'use strict';

const PROPERTY_VALUE = {
  power: {
    off: 0,
    on: 1,
  },
  mode: {
    auto: 0,
    cool: 1,
    dry: 2,
    fan_only: 3,
    heat: 4,
  },
  temperatureUnit: {
    celsius: 0,
    fahrenheit: 1,
  },
  // Add more property values as needed
};

module.exports = {
  PROPERTY_VALUE,
};
