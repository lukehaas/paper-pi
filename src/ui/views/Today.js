const moment = require('moment')

module.exports = class Today {
  constructor(options) {
    Object.assign(this, options)
  }

  _updated() {
    const x = this.width - 115
    const y = this.y + 9
    const time = moment().format('HH:mm')

    const updateText = {
      x,
      y,
      baseline: 'top',
      value: `Updated at ${time}`,
      style: { font: `11px "${this.font}"`, fill: this.fg }
    }
    this.sctx.text(updateText)
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

    return y + 48
  }

  async draw() {
    this._updated()
    const height = this._date()

    return { height }
  }
}
