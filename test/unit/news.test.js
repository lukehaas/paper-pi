jest.mock('node-fetch')
const News = require('../../src/data-sources/News')
const fetch = require('node-fetch')
const mongoose = require('mongoose')



describe('News', () => {
  const news = new News()
  describe('class', () => {
    it('returns instance of news class', () => {
      expect(news).toBeInstanceOf(News)
    })
  })

  describe('getHeadlines', () => {
    it('returns news data from fetch', async done => {
      const fetchPromise = jest.fn(() => new Promise(resolve => resolve({ json: () => ({ articles: [] }) })))
      fetch.mockImplementation(fetchPromise)

      news.getHeadlines().then(data => {
        expect(fetchPromise).toHaveBeenCalled()
        expect(data.articles).toBeTruthy()
        done()
      })
    })

    it('returns news data from mongo', async done => {
      const fetchPromise = jest.fn(() => new Promise(resolve => resolve({ })))
      fetch.mockImplementation(fetchPromise)

      news.getHeadlines().then(data => {
        expect(fetchPromise).toHaveBeenCalled()
        expect(data.complete).toBeTruthy()
        done()
      })
    })
  })

  describe('_getPrevious', () => {
    it('returns previously stored news data', async done => {
      news._getPrevious().then(data => {
        expect(data.complete).toBeTruthy()
        expect(mongoose.model().findOne).toHaveBeenCalled()
        done()
      })
    })
  })
})
