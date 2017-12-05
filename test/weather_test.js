const assert = require('assert')
const sinon = require('sinon')
const Weather = require('../src/Weather')

const DarkSky = require('dark-sky')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('Weather logic', () => {
  const darksky = sinon.stub(DarkSky.prototype, 'options')
  const ops = {
    latitude: 1,
    longitude: 1,
    units: 'uk2'
  }
  //beforeEach((done) => {})
  const instance = new Weather()

  describe('getForecast', () => {
    it('returns weather data', done => {
      darksky.returns({ get: () => new Promise(resolve => resolve({ 'currently': [true] })) })
      instance.getForecast(ops).then(data => {
        assert(data.currently.length === 1)
        done()
      })
    })
  })
  describe('_pluckForecast', () => {
    it('returns plucked data', () => {
      const data = {
        currently: [],
        daily: [],
        hourly: [],
        extra: []
      }
      const res = instance._pluckForecast(data)
      assert(res.hasOwnProperty('extra') === false && res.hasOwnProperty('currently') === true)
    })
  })
  describe('getPrevious', () => {
    it('returns the previously stored forecast', done => {
      instance.getPrevious().then(data => {
        assert(data.toObject().hasOwnProperty('currently') === true)
        done()
      })
    })
  })
})
