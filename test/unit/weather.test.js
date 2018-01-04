jest.mock('dark-sky')
const Weather = require('../../src/data-sources/Weather')
const DarkSky = require('dark-sky')
const mongoose = require('mongoose')
const dsGet = jest.fn(() => new Promise(resolve => resolve({ 'currently': [true] })))
DarkSky.mockImplementation(() => {
  return {
    options: () => ({
      get: dsGet
    })
  }
})

describe('Weather', () => {
  const weather = new Weather()
  describe('class', () => {
    it('returns instance of weather class', () => {
      expect(weather).toBeInstanceOf(Weather)
    })
  })

  describe('getForecast', () => {
    it('returns weather data', async done => {
      const ops = {
        latitude: 1,
        longitude: 1,
        units: 'uk2'
      }
      weather.getForecast(ops).then(data => {
        expect(dsGet).toHaveBeenCalled()
        expect(data.currently).toBeTruthy()
        expect(data.minutely).toBeFalsy()
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
      const res = weather._pluckForecast(data)
      expect(res.extra).toBeFalsy()
      expect(res.currently).toBeTruthy()
    })
  })

  describe('_getPrevious', () => {
    it('returns the previously stored forecast', async done => {
      weather._getPrevious().then(data => {
        expect(data.complete).toBeTruthy()
        expect(mongoose.model().findOne).toHaveBeenCalled()
        done()
      })
    })
  })
})
