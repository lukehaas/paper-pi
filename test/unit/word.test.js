jest.mock('twit')
jest.mock('oxford-dictionary-api')
const Word = require('../../src/Word')
const Twit = require('twit')
const Dictionary = require('oxford-dictionary-api')

const twitGet = jest.fn((a, b, callback) => {
  callback(false, [{ text: 'Word of the Day: hello' }])
})
Twit.mockImplementation(() => {
  return {
    get: twitGet
  }
})
const dicFind = jest.fn((word, callback) => {
  callback(false, {
    results: [{
      lexicalEntries: [{
        lexicalCategory: 'noun',
        pronunciations: [{
          phoneticSpelling: '$$'
        }],
        entries: [{
          senses: [{
            definitions: ['blah']
          }]
        }]
      }]
    }]
  })
})
Dictionary.mockImplementation(() => {
  return {
    find: dicFind
  }
})
jest.useFakeTimers()

describe('Word', () => {
  const word = new Word()
  describe('class', () => {
    it('Returns instance of word class', () => {
      expect(word).toBeInstanceOf(Word)
    })
  })

  describe('getWord', () => {
    it('Returns word data', async done => {
      word.getWord().then(data => {
        expect(data.word).toBe('Hello')
        done()
      })
    })
  })

  describe('_getPrevious', () => {
    it('Get previous word definition', async done => {
      word._getPrevious().then(data => {
        expect(data.complete).toBeTruthy()
        done()
      })
    })
  })

  describe('_getDefinition', () => {
    it('Get word from tweet and look it up', async done => {
      word._getDefinition().then(data => {
        expect(data.word).toBe('Hello')
        done()
      })
    })
  })

  describe('_lookupWord', () => {
    it('Returns word definition', async done => {
      new Promise((resolve, reject) => {
        word._lookupWord('word', resolve, reject)
      }).then(data => {
        expect(dicFind).toHaveBeenCalled()
        expect(data.definition).toBe('blah')
        done()
      })
    })
  })

  describe('_upperCaseFirstLetter', () => {
    it('Sets first letter of string to uppercase', () => {
      const str = word._upperCaseFirstLetter('hello')
      expect(str).toBe('Hello')
    })
  })

  describe('_getWordFromTweets', () => {
    it('Returns word from tweet', () => {
      const data = [{
        text: 'blah'
      },
      {
        text: 'Word of the Day: hello'
      }]
      const wordFromTweet = word._getWordFromTweets(data)
      expect(wordFromTweet).toBe('hello')
    })
  })

  describe('_getTweets', () => {
    it('Returns an array of tweets', async done => {
      word._getTweets(tweets => {
        expect(tweets).toEqual([{ text: 'Word of the Day: hello' }])
        expect(twitGet).toHaveBeenCalled()
        done()
      })
    })
  })

  describe('_clearTimer', () => {
    it('Calls clearTimeout', () => {
      word._clearTimer()
      expect(clearTimeout).toHaveBeenCalled()
    })
  })

  describe('_timer', () => {
    it('Calls reject after timeout', () => {
      const reject = jest.fn()
      word._timer(reject)
      expect(reject).not.toHaveBeenCalled()
      jest.runAllTimers()
      expect(reject).toHaveBeenCalled()

    })
  })
})
