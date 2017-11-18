const fetch = require('node-fetch')

module.exports = class News {
  constructor() {
    this.apiKey = process.env.news_key
  }

  getHeadlines() {
    const key = this.apiKey
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${key}`
    console.log(url)
    //const req = new Request(url)
    return fetch(url, { timeout: 3000 })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
