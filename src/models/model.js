const mongoose = require('mongoose')

const weatherSchema = {
  currently: Object,
  hourly: Object,
  daily: Object,
  updatedOn: { type: Date, default: Date.now }
}
const weatherModel = mongoose.model('Weather', weatherSchema)

const newsSchema = {
  articles: Object,
  updatedOn: { type: Date, default: Date.now }
}

const newsModel = mongoose.model('News', newsSchema)

module.exports = {
  weatherModel,
  newsModel
}
