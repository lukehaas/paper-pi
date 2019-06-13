// jest.mock('coinbase')
const Crypto = require('../../src/data-sources/Crypto')
// const  { Client } = require('coinbase')
const mongoose = require('mongoose')
const rates = {
  data: {
    rates: {
      GBP: '500'
    }
  }
}
const Client = jest.fn()
const getExchangeRates = jest.fn((data, callback) => callback(null, rates))
Client.mockImplementation(() => ({ getExchangeRates }))

describe('Crypto', () => {
  const crypto = new Crypto()
  describe('class', () => {
    it('returns instance of crypto class', () => {
      expect(crypto).toBeInstanceOf(Crypto)
    })
  })

  describe('getPrice', () => {
    // it('returns a coin price', async done => {
    //   crypto.getPrice('btc').then(price => {
    //     expect(getExchangeRates).toHaveBeenCalled()
    //     expect(price).toBe('500')
    //     done()
    //   })
    // })

    it('fails if no coin string supplied', async done => {
      crypto.getPrice().catch(res => {
        expect(res).toBe('Expected coin string')
        done()
      })
    })
  })

  describe('_getPrevious', () => {
    it('returns the previously stored price', async done => {
      crypto._getPrevious()().then(data => {
        expect(data).toBeTruthy()
        expect(mongoose.model().findOne).toHaveBeenCalled()
        done()
      })
    })
  })
})
