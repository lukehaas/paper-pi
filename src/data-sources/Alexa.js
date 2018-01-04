const AlexaSDK = require('alexa-sdk')
// https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html
module.exports = class Alexa {
  constructor() {}

  getShoppingList() {
    let lms = new AlexaSDK.services.ListManagementService()
    lms.getListsMetadata('amzn1.application-oa2-client.0433619635cd41f9b460cfc7974aa155')
      .then((data) => {
          console.log('List retrieved: ' + JSON.stringify(data))
          this.context.succeed()
      })
      .catch((error) => {
          console.log(error.message)
      })
  }
}

//client id
// amzn1.application-oa2-client.0433619635cd41f9b460cfc7974aa155
//client secret
// 673e2108c18db6b7503dbdfc51b39d42d9165700ac8af9b27d37b0034795b6b4
