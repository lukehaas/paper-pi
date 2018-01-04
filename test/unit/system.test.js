jest.mock('battery-level')
jest.mock('../../src/models/model')
const System = require('../../src/data-sources/System')
const { systemModel } = require('../../src/models/model')
const batteryLevel = require('battery-level')
const moment = require('moment')
const getBatteryLevel = jest.fn(() => new Promise(res => res(0.5)))

systemModel.findOne.mockImplementation(jest.fn(() => new Promise(res => res())))
batteryLevel.mockImplementation(getBatteryLevel)


describe('System', () => {
  const system = new System()
  describe('class', () => {
    it('returns instance of system class', () => {
      expect(system).toBeInstanceOf(System)
    })
  })

  describe('getCharge', () => {
    it('Returns a charge level', async done => {
      system.getCharge().then(charge => {
        expect(getBatteryLevel).toHaveBeenCalled()
        expect(charge).toBe(0.5)
        done()
      })
    })
  })

  describe('getUptime', () => {
    it('Returns number of days (plural)', async done => {
      const fiveDaysAgo = moment().subtract(5, 'days')
      const uptimeFindOne = jest.fn(cb => new Promise((res) => res(cb(null, { chargedOn: fiveDaysAgo }))))
      systemModel.findOne.mockImplementation(uptimeFindOne)
      system.getUptime().then(days => {
        expect(uptimeFindOne).toHaveBeenCalled()
        expect(days).toBe('5 days')
        done()
      })
    })

    it('Returns number of days (singular)', async done => {
      const fiveDaysAgo = moment().subtract(1, 'days')
      const uptimeFindOne = jest.fn(cb => new Promise((res) => res(cb(null, { chargedOn: fiveDaysAgo }))))
      systemModel.findOne.mockImplementation(uptimeFindOne)
      system.getUptime().then(days => {
        expect(uptimeFindOne).toHaveBeenCalled()
        expect(days).toBe('1 day')
        done()
      })
    })
  })

  describe('_getChargedOn', () => {
    it('Returns system record', async done => {
      const uptimeFindOne = jest.fn(cb => new Promise((res) => res(cb(null, { success: true }))))
      systemModel.findOne.mockImplementation(uptimeFindOne)
      system._getChargedOn().then(data => {
        expect(data.success).toBeTruthy()
        done()
      })
    })
  })

  describe('_saveCharge', () => {
  })

  describe('_updateCharge', () => {
  })
})
