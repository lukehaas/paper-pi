const { path } = require('ramda')
// const  { Client } = require('coinbase')
const { cryptoModel } = require('../models/model')
const config = require('../config')
class Client {
  getExchangeRates() {}
}

module.exports = class Crypto {
  constructor() {
    this.timeout = {}
    this.client = new Client({ 'apiKey': process.env.coinbase_key, 'apiSecret': process.env.coinbase_secret })
  }

  _timer(reject) {
    return setTimeout(reject, config.timeout, new Error('timeout'))
  }

  _clearTimer(coin) {
    clearTimeout(this.timeout[coin])
  }

  _callExchange(coin) {
    return new Promise((resolve, reject) => {
      this.client.getExchangeRates({ 'currency': coin }, (err, rates) => {
        this._clearTimer(coin)
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
          reject(this._getPrevious(coin))
        }
      })
    })
  }

  _getTimerPromise(coin) {
    return new Promise((_, reject) => {
      this.timeout[coin] = this._timer(reject)
    })
  }

  getPrice(coin) {
    if (!coin || typeof coin !== 'string') return new Promise((resolve, reject) => { reject('Expected coin string') })
    return Promise.race([
      this._callExchange(coin),
      this._getTimerPromise(coin)
    ]).catch(this._getPrevious(coin))
  }

  _getPrevious(coin) {
    return () => cryptoModel.findOne({ coin }, 'price', (err, doc) => doc).then(doc => doc.price)
  }
}
