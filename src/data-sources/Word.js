const Twit = require('twit')
const https = require('https')
const { path, compose } = require('ramda')
const { wordModel } = require('../models/model')
const config = require('../config')

class Dictionary {
  constructor(appId, appKey) {
    this.appId = appId
    this.appKey = appKey
  }

  find(word, cb) {
    const options = {
      host : 'od-api.oxforddictionaries.com',
      port : 443,
      path : `/api/v2/entries/en-gb/${word}`,
      method : 'GET',
      headers : {
        'Accept': 'application/json',
        'app_id': this.appId,
        'app_key': this.appKey,
      }
    }
    https.get(options, res => {
      if(res.statusCode == 404){
        cb('No such entry found')
      } else {
        let data = ''
        res.on('data', chunk => {
            data += chunk
        }).on('end', () => {
          let result = {}
          try {
            result = JSON.parse(data)
          } catch (exp) {
            result = {'status_code': 500, 'status_text': 'JSON Parse Failed'}
          }
          cb(null,result)
        }).on('error', err => {
          cb(err)
        })}
    })
  }
}

module.exports = class Word {
  constructor() {
    this.Twit = new Twit({
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret,
      timeout_ms: config.timeout
    })
    this.dict = new Dictionary(process.env.dictionary_app_id, process.env.dictionary_app_key)
  }

  _timer(reject) {
    return setTimeout(reject => {
      reject(new Error('timeout'))
    }, config.timeout*2, reject)
  }

  _clearTimer() {
    clearTimeout(this.timeout)
  }

  _getTweets(callback, error) {
    return this.Twit.get('statuses/user_timeline', { screen_name: 'OxfordWords',
    count: 50,
    exclude_replies: true,
    include_rts: false }, (err, data) => {
      if(!err) {
        callback(data)
      } else {
        error('Failed to get list')
      }
    })
  }

  _getWordFromTweets(data) {
    const predicate = 'Word of the Day:'
    const tweet = data.find(tweet => {
      return tweet.text.indexOf(predicate) === 0
    })
    return tweet && tweet.text.match(/^(.*)$/m)[0].replace(predicate, '').trim().split(' ')[0].trim()
  }

  _upperCaseFirstLetter(str) {
    return typeof str === 'string' && str.charAt(0).toUpperCase() + str.slice(1)
  }

  _lookupWord(word, resolve, reject) {
    this.dict.find(escape(word), (err, data) => {
      const category = path(['results', 0, 'lexicalEntries', 0, 'lexicalCategory'], data)
      const pronunciation = path(['results', 0, 'lexicalEntries', 0, 'pronunciations', 0, 'phoneticSpelling'], data)
      const definition = path(['results', 0, 'lexicalEntries', 0, 'entries', 0, 'senses', 0, 'definitions', 0], data)
      this._clearTimer()
      if(category && pronunciation && definition) {
        const wordOfTheDay = {
          word,
          definition,
          category,
          pronunciation
        }
        resolve(wordModel.findOne((err, doc) => {
          if(doc === null) {
            const newEntry = new wordModel(wordOfTheDay)
            newEntry.save()
          } else {
            Object.assign(doc, wordOfTheDay)
            doc.save()
          }
        }).then(() => wordOfTheDay))
      } else {
        reject(this._getPrevious)
      }
    })
  }

  _getDefinition() {
    return new Promise((resolve, reject) => {
      this._getTweets(response => {
        const getFormattedWord = compose(this._upperCaseFirstLetter, this._getWordFromTweets)
        const word = getFormattedWord(response)
        if(word) {
          this._lookupWord(word, resolve, reject)
        } else {
          this._clearTimer()
          reject(this._getPrevious)
        }
      }, reject)
    })
  }

  getWord() {
    this.timeout = undefined
    return Promise.race([
      this._getDefinition(),
      new Promise((_, reject) => {
        this.timeout = this._timer(reject)
      })
    ]).catch(this._getPrevious)
  }

  _getPrevious() {
    return wordModel.findOne((err, doc) => doc)
  }
}
