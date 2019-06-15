const { 
  Weather,
  Word,
  News,
} = require('./data-sources/index')
const Draw = require('./ui/Draw')
const mongoose = require('mongoose')
const fs = require('fs')
const winston = require('winston')
const { zipObj } = require('ramda')
require('dotenv').config()
mongoose.Promise = global.Promise

winston.add(winston.transports.File, { filename: 'error.log' })

const news = new News()
const weather = new Weather()
const word = new Word()

const init = () => new Promise((resolve, reject) => {
  mongoose.connect(process.env.mongo_uri, { useNewUrlParser: true }, err => {
    if(err) {
      winston.log('error', 'Connection to MongoDB failed %s', err)
    }
  })
  
  Promise.all([
    news.getHeadlines().catch(err => { winston.log('error', 'Failed to get news data %s', err) }),
    weather.getForecast({ latitude: 51.5074, longitude: 0.1278 }).catch(err => { winston.log('error', 'Failed to get weather data %s', err) }),
    word.getWord().catch(err => { winston.log('error', 'Failed to get word data %s', err) }),
  ])
  .then(zipObj(['headlines', 'forecast', 'wotd']))
  .then(resolve)
  .catch(reject)
})

function drawImage(data) {
  // if(data.charge < 0.05) {
  //   data.lowPower = true
  // }
  return new Draw({ orientation: 'portrait', ...data }).getImage()
}


module.exports = {
  start: () => new Promise((resolve, reject) => {
    init().then(drawImage).then(image => {
      mongoose.disconnect()
      fs.mkdir('./build', () => {
        fs.writeFile('./build/monocolor.bmp', image,  err => {
          if(err) {
            winston.log('error', 'Failed to write image - %s', err)
          }
          resolve()
        })
      })
    }).catch(err => {
      winston.log('error', 'Failed to initialize - %s', err)
      reject()
    })
  })
}