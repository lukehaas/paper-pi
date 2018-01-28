const moment = require('moment')

module.exports = class Today {
  constructor(options) {
    Object.assign(this, options)
  }

  _date() {
    const x = this.x + 8
    const y = this.y + 6
    const month = moment().format('MMM')
    const day = moment().format('DD')

    const dayText = {
      x,
      y: y + 8,
      baseline: 'top',
      value: day,
      style: { font: `39px "${this.font}"`, fill: this.fg }
    }
    const monthText = {
      x,
      y,
      baseline: 'top',
      value: month,
      style: { font: `16px "${this.font}"`, fill: this.fg }
    }
    const dayTextWidth = this.sctx.textWidth(dayText)
    const monthTextWidth = this.sctx.textWidth(monthText)

    const monthPosition = dayTextWidth/2 - monthTextWidth/2

    monthText.x = x + monthPosition
    this.sctx.text(monthText)
    this.sctx.text(dayText)

    return y + 72
  }

  async draw() {
    const height = this._date()

    return { height }
  }
}
