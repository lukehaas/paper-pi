const batteryLevel = require('battery-level')
const moment = require('moment')
const { systemModel } = require('../models/model')

module.exports = class System {
  constructor() {}

  getCharge() {
    return batteryLevel().then(charge => {
      return systemModel.findOne((err, doc) => {
        if(doc === null) {
          this._saveCharge(charge)
        } else {
          this._updateCharge(doc, charge)
        }
      }).then(() => charge)
    })
  }

  getUptime() {
    return this._getChargedOn().then(doc => {
      if(doc === null) {
        return '0 days'
      } else {
        const days = Math.abs(moment(doc.chargedOn).diff(Date.now(), 'd'))
        return days !== 1 ? `${days} days` : `${days} day`
      }
    })
  }

  _getChargedOn() {
    return systemModel.findOne((err, doc) => doc)
  }

  _saveCharge(charge) {
    const newEntry = new systemModel({ charge })
    newEntry.save()
  }

  _updateCharge(doc, charge) {
    const systemCharge = {
      charge
    }
    if(charge > doc.charge) {
      systemCharge.chargedOn = Date.now()
    }
    Object.assign(doc, systemCharge)
    doc.save()
  }
}
