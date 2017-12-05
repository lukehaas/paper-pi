const { createCanvas, registerFont } = require('canvas')
const shapely = require('../plugins/shapely')
const Weather = require('./views/Weather')

module.exports = class Draw {
  constructor(options) {
    this.orientation = options.orientation === 'landscape' ? 0 : 1
    this.width = this.orientation === 0 ? 640 : 384
    this.height = this.orientation === 0 ? 384 : 640
    this.canvas = createCanvas(this.width, this.height)
    const ctx = this.canvas.getContext('2d')
    ctx.antialias = 'none'
    this.sctx = shapely(ctx)

    this.forecast = options.forecast

    registerFont('./assets/fonts/Fira_Sans/FiraSans-Regular.ttf', {family: 'FiraSans'})
  }

  _drawBg() {
    this.sctx.rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      style: { fill: '#FFFFFF' }
    })
  }

  getImage() {
    return new Promise((resolve, reject) => {
      this._drawBg()

      new Weather({ width: this.width, data: this.forecast, sctx: this.sctx, x: 0, y: 300, canvas: this.canvas }).draw()
      .then(() => {
        console.log('after draw')
        resolve(this.canvas.toDataURL())
      })
    })



  }
}
