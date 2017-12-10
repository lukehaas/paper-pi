const fetch = require('node-fetch')
const { newsModel } = require('./models/model')

module.exports = class News {
  constructor() {
    this.apiKey = process.env.news_key
  }

  getHeadlines() {
    const key = this.apiKey
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${key}`
    return fetch(url, { timeout: 3000 })
      .then(response => {
        return response.json()
      })
      .then(data => {
        return newsModel.findOne((err, doc) => {
          if(doc === null && data.hasOwnProperty('articles')) {
            const newEntry = new newsModel(data)
            newEntry.save()
          } else if (data.hasOwnProperty('articles')) {
            doc.articles = data
            doc.save()
          }
        }).then(() => data)
      })
      .catch(this._getPrevious)
  }

  _getPrevious() {
    return newsModel.findOne((err, doc) => doc)
  }
}
