jest.mock('coinbase')
const Crypto = require('../../src/Crypto')
const  { Client } = require('coinbase')
Client.mockImplementation(() => {
  return {
    getExchangeRates: jest.fn()
  }
})

describe('Crypto', () => {
  const crypto = new Crypto()
  describe('class', () => {
    it('returns instance of crypto class', () => {
      expect(crypto).toBeInstanceOf(Crypto)
    })
  })
})
