const { createCanvas, registerFont } = require('canvas')
const shapely = require('shapely-canvas')
const Forecast = require('./views/Forecast')
const Battery = require('./views/Battery')
const Headlines = require('./views/Headlines')
const Today = require('./views/Today')
const Wotd = require('./views/Wotd')
const Currency = require('./views/Currency')
const bmp = require('bmp-js')
const winston = require('winston')
// Draw bitmaps by hand:
//http://magazine.art21.org/2011/09/13/how-to-create-a-bitmap-image-file-by-hand-without-stencils
module.exports = class Draw {
  constructor(options) {
    Object.assign(this, options)
    this.width = this.orientation === 'landscape' ? 640 : 384
    this.height = this.orientation === 'landscape' ? 384 : 640
    this.bg = '#000000'
    this.fg = '#FFFFFF'
    this.font = 'SourceCodePro-Regular'

    registerFont('./assets/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf', {family: 'SourceCodePro-Regular'})

    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
    //this.ctx.antialias = 'none'
    this.ctx.imageSmoothingEnabled = false
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
        return 0
      } else {
        return 255
      }
    })
    return { width: this.width, height: this.height, data }
  }

  async _drawImage() {
    await new Battery({ x: this.width - 170, y: 5, ...this }).draw().catch(err => winston.log('error', err))
    const today = await new Today({ x: 0, y: 0, ...this }).draw().catch(err => winston.log('error', err))

    const headlines = await new Headlines({ x: 0, y: today.height, ...this }).draw().catch(err => winston.log('error', err))

    await new Forecast({ x: 0, y: 300, ...this }).draw().catch(err => winston.log('error', err))

    await new Wotd({ x: 0, y: headlines.height, ...this }).draw().catch(err => winston.log('error', err))

    const btc = await new Currency({ x: this.width/2, y: headlines.height, coin: 'btc', ...this }).draw().catch(err => winston.log('error', err))
    const eth = await new Currency({ x: this.width/2, y: btc.height, coin: 'eth', ...this }).draw().catch(err => winston.log('error', err))
    await new Currency({ x: this.width/2, y: eth.height, coin: 'ltc', ...this }).draw().catch(err => winston.log('error', err))
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
      const imgData = this.ctx.getImageData(0, 0, this.width, this.height)
      const filteredImg = this._filterImage(imgData)
      const encodedBmp = bmp.encode(filteredImg).data
      resolve(encodedBmp)      
    })
  }
}
