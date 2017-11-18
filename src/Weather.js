const DarkSky = require('dark-sky')

module.exports = class Weather {
  constructor() {
    this.darksky = new DarkSky(process.env.darksky_key)
  }

  getForecast(options) {
    return this.darksky.options({
      latitude: options.latitude,
      longitude: options.longitude,
      units: 'uk2'
    })
    .get()
  }
}
/* possible icons:
clear-day,
clear-night,
rain,
snow,
sleet,
wind,
fog,
cloudy,
partly-cloudy-day,
partly-cloudy-night
*/
