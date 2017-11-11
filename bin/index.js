const Weather = require('../src/Weather')
const Draw = require('../src/Draw')

const forecast = new Weather().getForecast()

const image = new Draw().getImage()

console.log('<img src="' + image + '" />')
