const bmp = require('bmp-js')
const winston = require('winston')
const { createCanvas, registerFont, Image } = require('canvas')
const path = require('path')
const shapely = require('shapely-canvas')
const Forecast = require('./views/Forecast')
const Battery = require('./views/Battery')
const Headlines = require('./views/Headlines')
const Today = require('./views/Today')
const Wotd = require('./views/Wotd')
// Draw bitmaps by hand:
//http://magazine.art21.org/2011/09/13/how-to-create-a-bitmap-image-file-by-hand-without-stencils
module.exports = class Draw {
  constructor(options) {
    Object.assign(this, options)
    this.imageWidth = 640
    this.imageHeight = 384
    this.width = this.orientation === 'landscape' ? this.imageWidth : this.imageHeight
    this.height = this.orientation === 'landscape' ? this.imageHeight : this.imageWidth
    this.bg = '#000000'
    this.fg = '#FFFFFF'
    this.font = 'SourceCodePro-Regular'
    registerFont(path.join(__dirname, '../../', 'assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf'), {family: 'SourceCodePro-Regular'})

    this.canvas = createCanvas(this.width, this.height)
    this.imageCanvas = createCanvas(this.imageWidth, this.imageHeight)

    this.ctx = this.canvas.getContext('2d')
    this.imgCtx = this.imageCanvas.getContext('2d')

    //this.ctx.antialias = 'none'
    this.ctx.imageSmoothingEnabled = false
    this.imgCtx.imageSmoothingEnabled = false
    this.sctx = shapely(this.ctx)
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
      const colourThreshold = 40
      if(p < colourThreshold) {
        return 255
      } else {
        return 0
      }
    })
    return { width: this.imageWidth, height: this.imageHeight, data }
  }

  async _drawImage() {
    const today = await new Today({ x: 0, y: 0, ...this }).draw().catch(err => winston.log('error', err))
    const headlines = await new Headlines({ x: 0, y: today.height, ...this }).draw().catch(err => winston.log('error', err))
    await new Wotd({ x: 0, y: headlines.height, ...this }).draw().catch(err => winston.log('error', err))
    await new Forecast({ x: 0, y: 421, ...this }).draw().catch(err => winston.log('error', err))
  }

  async _drawLowPowerImage() {
    await new Battery({ x: 32, y: 245, ...this }).draw().catch(err => winston.log('error', err))
  }

  getImage() {
    return new Promise(async (resolve) => {
      this._drawBg()
      if(this.lowPower) {
        await this._drawLowPowerImage()
      } else {
        await this._drawImage()
      }

      // this is for portrait
      const img = new Image
      img.src = this.canvas.toBuffer()
      
      this.imgCtx.translate(this.imageWidth, 0)
      this.imgCtx.rotate(Math.PI/2)
      
      this.imgCtx.drawImage(img, 0, 0)

      const imgData = this.imgCtx.getImageData(0, 0, this.imageWidth, this.imageHeight)
      
      const filteredImg = this._filterImage(imgData)
      const encodedBmp = bmp.encode(filteredImg).data
      resolve(encodedBmp)
    })
  }
}
