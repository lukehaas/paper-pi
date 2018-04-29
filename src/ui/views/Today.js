const moment = require('moment')

module.exports = class Today {
  constructor(options) {
    Object.assign(this, options)
  }

  _date() {
    const x = this.x + 24
    const y = this.y + 18
    const day = moment().format('ddd Do MMMM')

    const dayText = {
      x,
      y,
      baseline: 'top',
      value: `${day}`,
      style: { font: `24px "${this.font}"`, fill: this.fg }
    }
    this.sctx.text(dayText)

    return y + 52
  }

  async draw() {
    const height = this._date()

    return { height }
  }
}
