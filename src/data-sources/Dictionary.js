const https = require('https')

module.exports = class Dictionary {
  constructor(appId, appKey) {
    this.appId = appId
    this.appKey = appKey
  }

  find(word, cb) {
    const options = {
      host : 'od-api.oxforddictionaries.com',
      port : 443,
      path : `/api/v2/entries/en-gb/${word}?fields=definitions,pronunciations`,
      method : 'GET',
      headers : {
        'Accept': 'application/json',
        'app_id': this.appId,
        'app_key': this.appKey,
      }
    }
    https.get(options, res => {
      if(res.statusCode == 404){
        cb('No such entry found')
      } else {
        let data = ''
        res.on('data', chunk => {
            data += chunk
        }).on('end', () => {
          let result = {}
          try {
            result = JSON.parse(data)
          } catch (exp) {
            result = {'status_code': 500, 'status_text': 'JSON Parse Failed'}
          }
          cb(null,result)
        }).on('error', err => {
          cb(err)
        })}
    })
  }
}
