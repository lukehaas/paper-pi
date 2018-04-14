const winston = require('winston')

module.exports = class Battery {
  constructor(options) {
    Object.assign(this, options)
  }

  _anode(x, y, width, height) {
    const cornerRadius = Math.round(height/5)
    this.sctx.rect({
      x: x - width/2,
      y,
      width,
      height,
      cornerRadius,
      style: {
        fill: this.fg
      }
    })
  }

  _charge(x, y, width, height) {
    const cornerRadius = Math.round(height/15)
    this.sctx.rect({
      x,
      y,
      width,
      height,
      cornerRadius,
      style: {
        fill: this.fg
      }
    })
  }

  _cell(x, y, width) {
    const height = width/2
    const strokeWidth = 2
    const cornerRadius = Math.round(height/10)
    const anodeHeight = height/3
    const anodeWidth = anodeHeight
    const anodeX = x + width
    const anodeY = y + height/2 - anodeHeight/2
    const chargeX = x + strokeWidth
    const chargeY = y + strokeWidth
    const chargeWidth = this.charge*(width - strokeWidth*2)
    const chargeHeight = height - strokeWidth*2
    this._anode(anodeX, anodeY, anodeWidth, anodeHeight)

    this.sctx.rect({
      x,
      y,
      width,
      height,
      cornerRadius,
      style: {
        fill: this.bg,
        strokeColor: this.fg,
        strokeWidth
      }
    })

    this._charge(chargeX, chargeY, chargeWidth, chargeHeight)
  }

  _uptime(x, y) {
    this.sctx.text({
      x,
      y,
      baseline: 'middle',
      value: `Uptime: ${this.uptime}`,
      style: { font: `11px "${this.font}"`, fill: this.fg }
    })
  }

  async draw() {
    if(!this.charge || !this.uptime) {
      winston.log('error', 'Battery values not present')
      return
    }
    if(this.lowPower) {
      this._cell(this.x, this.y, 300)
    } else {
      this._cell(this.x + 120, this.y, 30)
      this._uptime(this.x, this.y)
    }
  }
}
