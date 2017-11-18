const R = require('ramda')
const Client = require('coinbase').Client

module.exports = class Crypto {
  constructor() {
    this.client = new Client({ 'apiKey': process.env.coinbase_key, 'apiSecret': process.env.coinbase_secret })
  }

  async getPrice(coin) {
    if (!coin || typeof coin !== 'string') throw new Error('Expected coin string')

    return new Promise((resolve, reject) => {
      this.client.getExchangeRates({ 'currency': coin }, (err, rates) => {
        const price = R.path(['data', 'rates', 'GBP'], rates)
        if(price) {
          resolve(price)
        } else {
          reject(new Error('Call failed'))
        }
      })
    })
  }
}
