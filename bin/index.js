const Weather = require('../src/Weather')
const Crypto = require('../src/Crypto')
const Word = require('../src/Word')
const Alexa = require('../src/Alexa')
const System = require('../src/System')
const News = require('../src/News')
const Draw = require('../src/Draw')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
require('dotenv').config()

async function init() {
  mongoose.connect('mongodb://localhost/paper-pi', { useMongoClient: true })

  const bitcoin = 'test1'
  //const forecast = 'test2'
  const wod = 'test3'
  const shoppingList = 'test4'

  //await new News().getHeadlines().catch(e => console.log(e))

  //const bitcoin = await new Crypto().getPrice('BTC').catch(e => console.log(e))
  const weather = new Weather()
  const forecast = await weather.getForecast({ latitude: 51.5074, longitude: 0.1278 }).catch(() => weather.getPrevious())
  //const wod = await new Word().getWord().catch(e => console.log(e))
  //const shoppingList = new Alexa().getShoppingList()

  return { bitcoin, forecast, wod, shoppingList }
}


//const charge = new Battery().getCharge()



// date
// days since charge
// note of the day
// headlines?
// tube/bus status?
// store stuff to use again
//console.log(bitcoin)
async function handleData(data) {
  return await new Draw({ orientation: 'portrait', ...data }).getImage()
}
init().then(handleData).then(image => {
  mongoose.disconnect()
  const base64Data = image.replace(/^data:image\/png;base64,/, '')

  require('fs').writeFile('out.bmp', base64Data, 'base64', err => {
    console.log(err)
  })
  //console.log(image)
})
