const Weather = require('../src/Weather')
const Crypto = require('../src/Crypto')
const Word = require('../src/Word')
const Alexa = require('../src/Alexa')
const System = require('../src/System')
const News = require('../src/News')
const Draw = require('../src/Draw')
const mongoose = require('mongoose')
const fs = require('fs')
const winston = require('winston')
require('dotenv').config()
mongoose.Promise = global.Promise

async function init() {
  winston.add(winston.transports.File, { filename: 'error.log' })
  mongoose.connect(process.env.mongo_uri, { useMongoClient: true }, err => {
    if(err) {
      winston.log('error', 'Connection to MongoDB failed %s', err)
    }
  })

  const news = new News()
  const crypto = new Crypto()
  const weather = new Weather()
  const word = new Word()
  const alexa = new Alexa()

  const bitcoin = 'test1'
  //const forecast = 'test2'
  //const wotd = 'test3'
  const shoppingList = 'test4'
  //const headlines = 'test5'


  const headlines = await news.getHeadlines().catch(err => { winston.log('error', 'Failed to get news data %s', err) })
console.log(headlines)
  //const bitcoin = await crypto.getPrice('BTC').catch(err => { winston.log('error', 'Failed to get crypto data %s', err) })
  const forecast = await weather.getForecast({ latitude: 51.5074, longitude: 0.1278 }).catch(err => { winston.log('error', 'Failed to get weather data %s', err) })
  const wotd = await word.getWord().catch(err => { winston.log('error', 'Failed to get word data %s', err) })
  //const shoppingList = await alexa.getShoppingList().catch(e => console.log(e))

  return { headlines, bitcoin, forecast, wotd, shoppingList }
}



// date
// days since charge
// note of the day
// headlines?
// tube/bus status?
// store stuff to use again
// https://github.com/winstonjs/winston - logging
//console.log(bitcoin)
async function drawImage(data) {
  return await new Draw({ orientation: 'portrait', ...data }).getImage()
}
init().then(drawImage).then(image => {
  mongoose.disconnect()

  fs.writeFile('out.bmp', image,  err => {
    console.log(err)
  })
  //console.log(image)
}).catch(() => {
  winston.log('error', 'Failed to initialize')
})
