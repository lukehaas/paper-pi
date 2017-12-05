const mongoose = require('mongoose')
mongoose.Promise = global.Promise

before(done => {
  mongoose.connect('mongodb://localhost/paper-pi', { useMongoClient: true })
  mongoose.connection
  .once('open', () => { done() })
  .on('error', (error) => {
    console.warn('Warning', error)
  })
})

after(done => {
  mongoose.disconnect()
  done()
})
