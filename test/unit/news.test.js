const News = require('../../src/News')

describe('News', () => {
  const news = new News()
  describe('class', () => {
    it('returns instance of news class', () => {
      expect(news).toBeInstanceOf(News)
    })
  })
})
