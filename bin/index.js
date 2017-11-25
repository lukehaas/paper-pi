const Weather = require('../src/Weather')
const Crypto = require('../src/Crypto')
const Word = require('../src/Word')
const Alexa = require('../src/Alexa')
const Battery = require('../src/Battery')
const News = require('../src/News')
const Draw = require('../src/Draw')
require('dotenv').config()

async function init() {
  const bitcoin = 'test1'
  //const forecast = 'test2'
  const wod = 'test3'
  const shoppingList = 'test4'

  //await new News().getHeadlines().catch(e => console.log(e))

  //const bitcoin = await new Crypto().getPrice('BTC').catch(e => console.log(e))
  const forecast = await new Weather().getForecast({ latitude: 51.5074, longitude: 0.1278 }).catch(e => console.log(e))
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
init().then(data => {
  //console.log(data.bitcoin)
  console.log(data.forecast)
  //console.log(data.wod)

  //const image = new Draw({ orientation: 'landscape' }).getImage()
  //console.log(image)
})
