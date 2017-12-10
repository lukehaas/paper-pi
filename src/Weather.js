const DarkSky = require('dark-sky')
const { pick } = require('ramda')
const { weatherModel } = require('./models/model')

module.exports = class Weather {
  constructor() {
    this.darksky = new DarkSky(process.env.darksky_key)
  }

  _pluckForecast(data) {
    return pick(['currently', 'hourly', 'daily'], data)
  }

  getForecast(options) {
    if (!options || typeof options !== 'object') return new Promise((resolve, reject) => { reject('Expected options object') })
    return this.darksky.options({
      latitude: options.latitude,
      longitude: options.longitude,
      units: 'uk2',
      exclude: ['minutely', 'alerts']
    })
    .get()
    .then(data => {
      const dataSubset = this._pluckForecast(data)
      return weatherModel.findOne((err, doc) => {
        if(doc === null) {
          const newEntry = new weatherModel(dataSubset)
          newEntry.save()
        } else if (dataSubset.hasOwnProperty('currently') && dataSubset.hasOwnProperty('hourly') && dataSubset.hasOwnProperty('daily')) {
          Object.assign(doc, this._pluckForecast(doc))
          doc.save()
        }
      }).then(() => dataSubset)
    }).then(data => data)
    .catch()
  }

  getPrevious() {
    return weatherModel.findOne((err, doc) => doc)
  }
}
