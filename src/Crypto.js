const { path } = require('ramda')
const  { Client } = require('coinbase')
const { cryptoModel } = require('./models/model')
const config = require('./config')

module.exports = class Crypto {
  constructor() {
    this.client = new Client({ 'apiKey': process.env.coinbase_key, 'apiSecret': process.env.coinbase_secret })
  }

  _timer(reject) {
    return setTimeout(reject => {
      reject(new Error('timeout'))
    }, config.timeout, reject)
  }

  _clearTimer() {
    clearTimeout(this.timeout)
  }

  _callExchange() {
    const coin = this.coin
    return new Promise((resolve, reject) => {
      this.client.getExchangeRates({ 'currency': coin }, (err, rates) => {
        this._clearTimer()
        const price = path(['data', 'rates', 'GBP'], rates)
        if(price) {
          resolve(cryptoModel.findOne({ coin }, 'price', (err, doc) => {
            if(doc === null) {
              const data = {
                coin,
                price
              }
              const newEntry = new cryptoModel(data)
              newEntry.save()
            } else {
              doc.price = price
              doc.save()
            }
          }).then(() => price))
        } else {
          reject(this._getPrevious())
        }
      })
    })
  }

  getPrice(coin) {
    if (!coin || typeof coin !== 'string') return new Promise((resolve, reject) => { reject('Expected coin string') })
    this.timeout = undefined
    this.coin = coin

    return Promise.race([
      this._callExchange(),
      new Promise((_, reject) => {
        this.timeout = this._timer(reject)
      })
    ]).catch(this._getPrevious())
  }

  _getPrevious() {
    const coin = this.coin
    return () => cryptoModel.findOne({ coin }, 'price', (err, doc) => doc).then(doc => doc.price)
  }
}
