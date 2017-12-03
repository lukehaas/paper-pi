const DarkSky = require('dark-sky')
const R = require('ramda')

module.exports = class Weather {
  constructor() {
    this.darksky = new DarkSky(process.env.darksky_key)
  }

  _pluckForecast(data) {
    return R.pick(['currently', 'hourly', 'daily'], data)
  }

  getForecast(options) {
    // need to fix this bit
    if (!options || typeof options !== 'object') throw new Error('Expected options object')
    
    return this.darksky.options({
      latitude: options.latitude,
      longitude: options.longitude,
      units: 'uk2'
    })
    .get()
    .then(data => {
      return this._pluckForecast(data)
    })
    .catch()
  }

  getPrevious() {}
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

hail, thunderstorm, tornado
*/
