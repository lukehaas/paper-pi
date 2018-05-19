const { Weather,
  Crypto,
  Word,
  System,
  News,
  Notes,
  Tfl } = require('./data-sources/index')
const Draw = require('./ui/Draw')
const mongoose = require('mongoose')
const fs = require('fs')
const winston = require('winston')
const { zipObj } = require('ramda')
require('dotenv').config()
mongoose.Promise = global.Promise

const init = () => new Promise((resolve, reject) => {
  winston.add(winston.transports.File, { filename: 'error.log' })
  mongoose.connect(process.env.mongo_uri, { useMongoClient: true }, err => {
    if(err) {
      winston.log('error', 'Connection to MongoDB failed %s', err)
    }
  })
  // const system = new System()
  const news = new News()
  const crypto = new Crypto()
  const weather = new Weather()
  const word = new Word()
  const tfl = new Tfl()
  //const notes = new Notes()
  //const alexa = new Alexa()
  Promise.all([
    // system.getCharge().catch(err => { winston.log('error', 'Failed to get battery charge %s', err) }),
    // system.getUptime().catch(err => { winston.log('error', 'Failed to get uptime %s', err) }),
    news.getHeadlines().catch(err => { winston.log('error', 'Failed to get news data %s', err) }),
    crypto.getPrice('BTC').catch(err => { winston.log('error', 'Failed to get BTC price %s', err) }),
    crypto.getPrice('ETH').catch(err => { winston.log('error', 'Failed to get ETH price %s', err) }),
    crypto.getPrice('LTC').catch(err => { winston.log('error', 'Failed to get LTC price %s', err) }),
    weather.getForecast({ latitude: 51.5074, longitude: 0.1278 }).catch(err => { winston.log('error', 'Failed to get weather data %s', err) }),
    word.getWord().catch(err => { winston.log('error', 'Failed to get word data %s', err) }),
    tfl.getLineStatus().catch(err => { winston.log('error', 'Failed to get TFL line status %s', err) })
  ])
  .then(zipObj(['headlines', 'btc', 'eth', 'ltc', 'forecast', 'wotd', 'tubeStatus']))
  .then(resolve)
  .catch(reject)
})


// date
// days since charge
// note of the day
// tube/bus status?
function drawImage(data) {
  if(data.charge < 0.05) {
    data.lowPower = true
  }
  return new Draw({ orientation: 'portrait', ...data }).getImage()
}
init().then(drawImage).then(image => {
  mongoose.disconnect()
  fs.mkdir('./build', () => {
    fs.writeFile('./build/monocolor.bmp', image,  err => {
      if(err) {
        winston.log('error', 'Failed to write image - %s', err)
      }
    })
  })
}).catch(err => {
  winston.log('error', 'Failed to initialize - %s', err)
})
