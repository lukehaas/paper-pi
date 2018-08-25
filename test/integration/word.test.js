const Word = require('../../src/data-sources/Word')
require('dotenv').config()

describe('Word', () => {
  const word = new Word()
  describe('_getWordFromTweets', () => {
    it('gets word from tweet', () => {
      const tweet = 'Word of the Day: Hello'
      const data = [{
        text: tweet
      }]
      const response = word._getWordFromTweets(data)
      expect(response).toBe('Hello')
    })
  })

  describe('_getDefinition', () => {
    it('gets word definition', async done => {
      word._getDefinition().then(response => {
        expect(response).toHaveProperty('word')
        done()
      })
    })
  })
})