const DarkSky = require('dark-sky')
const R = require('ramda')
const mongoose = require('mongoose')

module.exports = class Weather {
  constructor() {
    this.darksky = new DarkSky(process.env.darksky_key)

    const weatherSchema = {
      currently: Object,
      hourly: Object,
      daily: Object,
      updatedOn: { type: Date, default: Date.now }
    }

    this.weatherCollection = mongoose.model('Weather', weatherSchema)
  }

  _pluckForecast(data) {
    return R.pick(['currently', 'hourly', 'daily'], data)
  }

  getForecast(options) {
    if (!options || typeof options !== 'object') return new Promise((resolve, reject) => { reject('Expected options object') })

    return this.darksky.options({
      latitude: options.latitude,
      longitude: options.longitude,
      units: 'uk2'
    })
    .get()
    .then(data => {
      const dataSubset = this._pluckForecast(data)
      return this.weatherCollection.findOne((err, doc) => {
        if(doc === null) {
          const newEntry = new this.weatherCollection(dataSubset)
          newEntry.save()
        } else if (dataSubset.hasOwnProperty('currently') && dataSubset.hasOwnProperty('hourly') && dataSubset.hasOwnProperty('daily')) {
          doc.currently = dataSubset.currently
          doc.hourly = dataSubset.hourly
          doc.daily = dataSubset.daily
          doc.save()
        }
      }).then(() => dataSubset)
    }).then(data => data)
    .catch()
  }

  getPrevious() {
    return this.weatherCollection.findOne((err, doc) => doc)
  }
}
