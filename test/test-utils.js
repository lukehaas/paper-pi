const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = {
  setup: done => {
    mongoose.connect('mongodb://localhost/paper-pi', { useMongoClient: true })
    mongoose.connection
    .once('open', () => {
      done()
    })
    .on('error', (error) => {
      console.warn('Warning', error)
    })
  },
  complete: done => {
    mongoose.disconnect()
    done()
  }
}
