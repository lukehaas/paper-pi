const winston = require('winston')

module.exports = class Headlines {
  constructor(options) {
    Object.assign(this, options)
  }

  _newsList(data) {
    const gap = 16
    const x = this.x + 24
    const y = this.y
    const maxWidth = this.width - x
    const limit = 5
    // this.sctx.text({
    //   x,
    //   y,
    //   value: 'Headlines',
    //   maxWidth,
    //   style: {
    //     font: `16px "${this.font}"`, fill: this.fg
    //   }
    // })
    return data.slice(0, limit).reduce((y, { title }, i) => {
      const text = {
        x,
        y,
        value: title.length > 66 ? title.substr(0, 66) + '...' : title,
        maxWidth,
        baseline: 'top',
        style: {
          font: `16px "${this.font}"`, fill: this.fg
        }
      }
      this.sctx.text(text)

      y += this.sctx.textHeight(text)
      if(i < limit - 1) {
        this.sctx.line({
          x,
          y: y + 10,
          width: maxWidth,
          dashWidth: 2,
          dashGap: 2,
          style: {
            strokeStyle: 'dashed',
            strokeColor: this.fg,
            strokeWidth: 1
          }
        })
      }
      return y += gap
    }, y)
  }

  async draw() {
    if(!Array.isArray(this.headlines.articles)) {
      winston.log('error', 'Headlines - articles not array')
      return { height: this.y }
    }
    const height = 12 + this._newsList(this.headlines.articles)

    return { height }
  }
}
