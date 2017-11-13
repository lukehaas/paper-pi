const Weather = require('../src/Weather')
const Crypto = require('../src/Crypto')
const Word = require('../src/Word')
const Alexa = require('../src/Alexa')
const Battery = require('../src/Battery')
const Draw = require('../src/Draw')

const forecast = new Weather().getForecast('location')

const bitcoin = new Crypto().getPrice('')

const word = new Word().getWord()

const shoppingList = new Alexa().getShoppingList()

const charge = new Battery().getCharge()

const image = new Draw().getImage()

// date
// days since charge
// note of the day
// headlines?
// tube/bus status?
// store stuff to use again
console.log(image)
