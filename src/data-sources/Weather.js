const DarkSky = require('dark-sky')
const { pick, path } = require('ramda')
const { weatherModel } = require('../models/model')
const config = require('../config')

module.exports = class Weather {
  constructor() {
    this.darksky = new DarkSky(process.env.darksky_key)
  }

  _timer(reject) {
    return setTimeout(reject => {
      reject(new Error('timeout'))
    }, config.timeout, reject)
  }

  _clearTimer() {
    clearTimeout(this.timeout)
  }

  _pluckForecast(data) {
    return pick(['currently', 'hourly', 'daily'], data)
  }

  _hasProps(data) {
    return data.hasOwnProperty('currently') && data.hasOwnProperty('hourly') && data.hasOwnProperty('daily') ? true : false
  }

  _weatherData(options) {
    return this.darksky.options({
      latitude: options.latitude,
      longitude: options.longitude,
      units: 'uk2',
      exclude: ['minutely', 'alerts']
    })
    .get()
    .then(data => {
      this._clearTimer()
      const dataSubset = this._pluckForecast(data)
      return weatherModel.findOne((err, doc) => {
        if(doc === null && this._hasProps(dataSubset)) {
          const newEntry = new weatherModel(dataSubset)
          newEntry.save()
        } else if(this._hasProps(dataSubset) && this._hasProps(doc)) {
          Object.assign(doc, dataSubset)
          doc.save()
        }
      }).then(() => dataSubset)
    }).then(data => data)
    .catch(this._getPrevious)
  }

  getForecast(options) {
    if (!options || typeof options !== 'object' || !path(['latitude', options]) || !path(['longitude', options]))
    return new Promise((resolve, reject) => { reject('Expected options object') })

    this.timeout = undefined
    return Promise.race([
      this._weatherData(options),
      new Promise((_, reject) => {
        this.timeout = this._timer(reject)
      })
    ]).catch(this._getPrevious)
  }

  _getPrevious() {
    return weatherModel.findOne((err, doc) => doc)
  }
}
