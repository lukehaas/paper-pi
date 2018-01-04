const winston = require('winston')

module.exports = class Headlines {
  constructor(options) {
    Object.assign(this, options)
  }

  _newsList(data) {
    const gap = 8
    const x = this.x + 9
    const y = this.y
    const maxWidth = this.width/2
    this.sctx.text({
      x,
      y,
      value: 'Headlines',
      maxWidth,
      style: {
        font: `13px "${this.font}"`, fill: this.fg
      }
    })
    return data.slice(0, 5).reduce((y, n) => {
      const text = {
        x,
        y,
        value: n.title,
        maxWidth,
        baseline: 'top',
        style: {
          font: `13px "${this.font}"`, fill: this.fg
        }
      }
      this.sctx.text(text)

      y += this.sctx.textHeight(text)
      this.sctx.line({
        x,
        y: y + 6,
        width: maxWidth,
        dashWidth: 2,
        dashGap: 2,
        style: {
          strokeStyle: 'dashed',
          strokeColor: this.fg,
          strokeWidth: 1
        }
      })

      return y += gap
    }, y + 8)
  }

  async draw() {
    if(!Array.isArray(this.headlines.articles)) {
      winston.log('error', 'Headlines - articles not array')
      return { height: 0 }
    }
    const height = this._newsList(this.headlines.articles)

    return { height }
  }
}
