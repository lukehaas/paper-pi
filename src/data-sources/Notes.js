const fetch = require('node-fetch')

module.exports = class Notes {
  constructor() {}

  getNote() {
    const url = ''
    return fetch(url, { timeout: config.timeout })
      .then(response => {
        return response.json()
      })
      .then(data => data)
  }
}
