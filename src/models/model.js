const mongoose = require('mongoose')

const weatherSchema = {
  currently: Object,
  hourly: Object,
  daily: Object,
  updatedOn: { type: Date, default: Date.now }
}
const weatherModel = mongoose.model('Weather', weatherSchema)

module.exports = {
  weatherModel
}
