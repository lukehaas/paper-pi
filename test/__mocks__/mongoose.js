const findOne = jest.fn(() => new Promise(resolve => resolve({ complete: true })))

module.exports = {
  model: jest.fn(() => {
    return {
      findOne
    }
  })
}
