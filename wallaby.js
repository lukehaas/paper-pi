require('dotenv').config({path: '.env'})
module.exports = function() {
  return {
    files: ['src/**/*.js'],

    tests: ['test/**/*.test.js'],

    env: {
      type: 'node',
      runner: 'node',
    },

    testFramework: 'jest',
  }
}
