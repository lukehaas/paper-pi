const { path } = require('ramda')
const  { Client } = require('coinbase')
const { cryptoModel } = require('./models/model')

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
          resolve(cryptoModel.findOne((err, doc) => {
            const coinLower = coin.toLowerCase()
            if(doc === null) {
              const data = {
                [coinLower]: price
              }
              const newEntry = new cryptoModel(data)
              newEntry.save()
            } else {
              doc[coinLower] = price
              doc.save()
            }
          }).then(() => price))
        } else {
          reject(this._getPrevious)
        }
      })
    })
  }

  _getPrevious() {
    return cryptoModel.findOne((err, doc) => doc)
  }
}
