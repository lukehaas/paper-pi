const Weather = require('../src/Weather')
const Crypto = require('../src/Crypto')
const Word = require('../src/Word')
const Alexa = require('../src/Alexa')
const Battery = require('../src/Battery')
const Draw = require('../src/Draw')

async function init() {
  const bitcoin = 'test1'
  const forecast = 'test2'

  //const bitcoin = await new Crypto().getPrice('BTC').catch(e => console.log(e))
  //const forecast = await new Weather().getForecast().catch(e => console.log(e))
  const wod = await new Word().getWord().catch(e => console.log(e))
  return { bitcoin, forecast, wod }
}
//const forecast = new Weather().getForecast('location')


//const word = new Word().getWord()

//const shoppingList = new Alexa().getShoppingList()

//const charge = new Battery().getCharge()



// date
// days since charge
// note of the day
// headlines?
// tube/bus status?
// store stuff to use again
//console.log(bitcoin)
init().then(data => {
  console.log(data.bitcoin)
  console.log(data.forecast)
  const image = new Draw('landscape').getImage()
  console.log(image)
})
