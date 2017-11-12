const Weather = require('../src/Weather')
const Crypto = require('../src/Crypto')
const Draw = require('../src/Draw')

const forecast = new Weather().getForecast('location')

const bitcoin = new Crypto().getPrice('')

const image = new Draw().getImage()

// bitcoin price
// alexa shopping list
// 
console.log(image)
