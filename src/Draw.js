const { createCanvas, registerFont } = require('canvas')
const shapely = require('shapely-canvas')
const Weather = require('./views/Weather')
const bmp = require('bmp-js')
// Draw bitmaps by hand:
//http://magazine.art21.org/2011/09/13/how-to-create-a-bitmap-image-file-by-hand-without-stencils
module.exports = class Draw {
  constructor(options) {
    this.orientation = options.orientation === 'landscape' ? 0 : 1
    this.width = this.orientation === 0 ? 640 : 384
    this.height = this.orientation === 0 ? 384 : 640
    this.bg = '#000000'
    this.fg = '#FFFFFF'
    this.font = 'SourceCodePro-Regular'
    //this.font = 'FiraSans'

    registerFont('./assets/fonts/Fira_Sans/FiraSans-Regular.ttf', {family: 'FiraSans'})
    registerFont('./assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf', {family: 'SourceCodePro-Regular'})

    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
    //this.ctx.antialias = 'none'
    this.ctx.imageSmoothingEnabled = false
    this.sctx = shapely(this.ctx)

    this.forecast = options.forecast
  }

  _drawBg() {
    this.sctx.rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      style: { fill: this.bg }
    })
  }

  _filterImage(imgData) {
    const data = imgData.data.map(p => {
      // using 40 as theshold
      if(p < 40) {
        return 0
      } else {
        return 255
      }
    })
    //return imgData
    return { width: this.width, height: this.height, data }
  }

  getImage() {
    return new Promise((resolve, reject) => {
      this._drawBg()

      new Weather({ x: 0, y: 300, ...this }).draw()
      .then(() => {
        const imgData = this.ctx.getImageData(0, 0, this.width, this.height)
        const filteredImg = this._filterImage(imgData)

        const encodedBmp = bmp.encode(filteredImg).data
        resolve(encodedBmp)
      })
      .catch(() => {
        reject('Failed to draw image')
      })
    })



  }
}
