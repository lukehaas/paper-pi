const fetch = require('node-fetch')
const { path } = require('ramda')
const { tflModel } = require('../models/model')
const config = require('../config')

module.exports = class Tfl {
  constructor() {
    this.appId = process.env.tfl_app_id
    this.appKey = process.env.tfl_app_key
  }

  _formatData(data) {
    return data.reduce((arr, item) => {
      if (item.id === 'jubilee' || item.id === 'metropolitan') {
        arr.push({
            line: path(['name'], item),
            status: path(['lineStatuses', 0, 'statusSeverityDescription'], item)
          })
      }
      return arr
    }, [])
  }

  getLineStatus() {
    const url = 'https://api.tfl.gov.uk/line/mode/tube/status'
    return fetch(url, { timeout: config.timeout })
      .then(response => {
        return response.json()
      })
      .then(data => {
        return tflModel.findOne((err, doc) => {
          const statuses = this._formatData(data)
          if(doc === null && statuses.length) {
            const newEntry = new tflModel({ statuses })
            newEntry.save()
          } else if (statuses.length) {
            doc.statuses = statuses
            doc.save()
          }
        }).then(() => ({ statuses }))
      })
      .catch(this._getPrevious)
  }

  _getPrevious() {
    return tflModel.findOne((err, doc) => doc)
  }
}
