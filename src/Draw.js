const { createCanvas, loadImage, Image } = require('canvas')
const shapely = require('../plugins/shapely')

const Weather = require('./views/Weather')

module.exports = class Draw {
  constructor(options) {
    this.orientation = options.orientation === 'landscape' ? 0 : 1
    this.width = this.orientation === 0 ? 640 : 384
    this.height = this.orientation === 0 ? 384 : 640

    this.forecast = options.forecast
  }

  getImage() {
    //ctx.measureText(txt).width
    const canvas = createCanvas(this.width, this.height)
    const ctx = canvas.getContext('2d')
    const sctx = shapely(ctx)

    sctx.rect({
      x: 10,
      y: 10,
      width:100,
      height: 100,
      style: { fill: '#000000' }
    })

    sctx.rect({
      x: 110,
      y: 110,
      width:100,
      height: 100,
      style: { fill: '#ff0000' }
    })

    new Weather({ width: this.width, data: this.forecast, sctx, x: 0, y: 0 }).draw()


    return canvas.toDataURL()
  }
}
