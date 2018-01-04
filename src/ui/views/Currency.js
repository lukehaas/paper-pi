const { loadImage } = require('canvas')
const winston = require('winston')

module.exports = class Currency {
  constructor(options) {
    Object.assign(this, options)
  }

  _coinPrice(x, y, price) {
    return new Promise((resolve, reject) => {
      const imagePath = `./assets/images/coins/${this.coin}.png`
      const imageSize = 20
      this.sctx.text({
        x: x + 25,
        y: y + 13,
        value: parseFloat(price).toLocaleString(),
        style: { font: `13px "${this.font}"`, fill: this.fg }
      })
      loadImage(imagePath).then(image => {
        this.sctx.image({
          image,
          x,
          y,
          width: imageSize,
          height: imageSize
        })
        resolve(y + imageSize)
      })
      .catch(() => {
        reject('Failed to load image')
      })
    })
  }

  async draw() {
    if(!this.coin && !this[this.coin]) {
      winston.log('error', 'Currency - not present')
      return
    }
    const y = this.y + 10
    const height = await this._coinPrice(this.x, y, this[this.coin])
    return { height }
  }
}
