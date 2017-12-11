const mongoose = require('mongoose')

const weatherModel = () => {
  const weatherSchema = {
    currently: Object,
    hourly: Object,
    daily: Object,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('Weather', weatherSchema)
}

const newsModel = () => {
  const newsSchema = {
    articles: Object,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('News', newsSchema)
}

const cryptoModel = () => {
  const cryptoSchema = {
    btc: String,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('Crypto', cryptoSchema)
}

module.exports = {
  weatherModel: weatherModel(),
  newsModel: newsModel(),
  cryptoModel: cryptoModel()
}
