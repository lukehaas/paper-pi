const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 8001

const requestHandler = (request, response) => {
  fs.readFile(path.join(__dirname, '../build/monocolor.bmp'), (error, content) => {
    response.writeHead(200, { 'Content-Type': 'image/bmp' })
    response.end(content, 'utf-8')
  })
}

const server = http.createServer(requestHandler)

server.listen(port, err => {
  if (err) {
    return console.log('Something went wrong', err)
  }
})
