const { path } = require('ramda')
const  { Client } = require('coinbase')

module.exports = class Crypto {
  constructor() {
    this.client = new Client({ 'apiKey': process.env.coinbase_key, 'apiSecret': process.env.coinbase_secret })
  }

  async getPrice(coin) {
    if (!coin || typeof coin !== 'string') return new Promise((resolve, reject) => { reject('Expected coin string') })

    return new Promise((resolve, reject) => {
      this.client.getExchangeRates({ 'currency': coin }, (err, rates) => {
        const price = path(['data', 'rates', 'GBP'], rates)
        if(price) {
          resolve(price)
        } else {
          reject(this._getPrevious)
        }
      })
    })
  }

  _getPrevious() {
    console.log('get previous crypto')
  }
}
