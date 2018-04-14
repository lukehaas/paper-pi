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
    coin: String,
    price: String,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('Crypto', cryptoSchema)
}

const wordModel = () => {
  const wordSchema = {
    word: String,
    definition: String,
    category: String,
    pronunciation: String,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('Word', wordSchema)
}

const systemModel = () => {
  const systemSchema = {
    charge: Number,
    chargedOn: Date,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('System', systemSchema)
}

const tflModel = () => {
  const tflSchema = {
    statuses: Object,
    updatedOn: { type: Date, default: Date.now }
  }
  return mongoose.model('Tfl', tflSchema)
}

module.exports = {
  weatherModel: weatherModel(),
  newsModel: newsModel(),
  cryptoModel: cryptoModel(),
  wordModel: wordModel(),
  systemModel: systemModel(),
  tflModel: tflModel()
}
