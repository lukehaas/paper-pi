const generate = require('./generate')

generate.start().then(() => {
  console.log('Done')
}).catch(() => {
  console.log('Fail')
})
