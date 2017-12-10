jest.mock('twit')
jest.mock('oxford-dictionary-api')
const Word = require('../../src/Word')
const Twit = require('twit')
const Dictionary = require('oxford-dictionary-api')
Twit.mockImplementation(() => {
  return {
    get: jest.fn()
  }
})
Dictionary.mockImplementation(() => {
  return {
    find: jest.fn()
  }
})

describe('Word', () => {
  const word = new Word()
  describe('class', () => {
    it('returns instance of word class', () => {
      expect(word).toBeInstanceOf(Word)
    })
  })
})
