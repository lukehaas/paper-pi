const { createCanvas, loadImage, Image } = require('canvas')
const shapely = require('../plugins/shapely')

module.exports = class Draw {
  constructor() {

  }

  getImage() {
    const canvas = createCanvas(640, 384)
    const ctx = canvas.getContext('2d')
    const s = shapely(ctx)

    s.rect({
      x: 10,
      y: 10,
      width:100,
      height: 100,
      style: { fill: "#000000" }
    })

    s.rect({
      x: 110,
      y: 110,
      width:100,
      height: 100,
      style: { fill: "#ff0000" }
    })


    return canvas.toDataURL()
  }
}
