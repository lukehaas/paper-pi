const Twit = require('twit')
//const Dictionary = require("oxford-dictionary");
const Dictionary = require("oxford-dictionary-api");
require('dotenv').config()

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

  getWord() {
    return new Promise((resolve, reject) => {
      this._getTweets(response => {
        const word = this._getWordFromTweets(response)
        this.dict.find(word, (erro, data) => {
          console.log(data.results[0].lexicalEntries[0].entries[0].senses);
          resolve()
        })
        console.log(word)

      }, reject)
    })
  }
}
