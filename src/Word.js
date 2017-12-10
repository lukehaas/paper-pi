const Twit = require('twit')
const Dictionary = require('oxford-dictionary-api')
const { path, compose } = require('ramda')

module.exports = class Word {
  constructor() {
    this.Twit = new Twit({
      consumer_key: process.env.twitter_consumer_key,
      consumer_secret: process.env.twitter_consumer_secret,
      access_token: process.env.twitter_access_token,
      access_token_secret: process.env.twitter_access_token_secret,
      timeout_ms: 3000
    })
    this.dict = new Dictionary(process.env.dictionary_app_id, process.env.dictionary_app_key)
  }

  _getTweets(callback, error) {
    return this.Twit.get('statuses/user_timeline', { screen_name: 'OxfordWords',
    count: 10,
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
    return data.find(tweet => {
      return tweet.text.indexOf(predicate) === 0
    }).text.match(/^(.*)$/m)[0].replace(predicate, '').trim()
  }

  _upperCaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  _getDefinition() {
    return new Promise((resolve, reject) => {
      this._getTweets(response => {
        const getFormattedWord = compose(this._upperCaseFirstLetter, this._getWordFromTweets)
        const word = getFormattedWord(response)
        this.dict.find(word, (erro, data) => {
          const def = path(['results', 0, 'lexicalEntries', 0, 'entries', 0, 'senses', 0, 'definitions', 0], data)
          clearTimeout(this.timeout)
          if(def) {
            resolve(`${word} - ${def}`)
          } else {
            reject('Dictionary fail')
          }
        })
      }, reject)
    })
  }

  _timer(reject) {
    return setTimeout(reject => {
      reject(new Error('timeout'))
    }, 6000, reject)
  }

  getWord() {
    this.timeout = undefined
    return Promise.race([
      this._getDefinition(),
      new Promise((_, reject) => {
        this.timeout = this._timer(reject)
      })
    ]).catch()
  }

  getPrevious() {
    console.log('get previous')
  }
}
