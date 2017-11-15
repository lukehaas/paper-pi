const DarkSky = require('dark-sky')

module.exports = class Weather {
  constructor() {
    this.darksky = new DarkSky(process.env.darksky_key)
  }

  getForecast() {
    return this.darksky.options({
      latitude: 51.5074,
      longitude: 0.1278,
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
