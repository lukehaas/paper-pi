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

  _hasProps(data) {
    return data.hasOwnProperty('currently') && data.hasOwnProperty('hourly') && data.hasOwnProperty('daily') ? true : false
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

  _getPrevious() {
    return weatherModel.findOne((err, doc) => doc)
  }
}
