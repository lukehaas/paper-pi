const winston = require('winston')
const { compose, not, hasIn } = require('ramda')

module.exports = class Wotd {
  constructor(options) {
    Object.assign(this, options)
  }

  _word(data) {
    const x = this.x + 24
    const y = this.y
    const maxWidth = this.width - x
    this.sctx.text({
      x,
      y,
      value: 'Word of the Day',
      style: { font: `15px "${this.font}"`, fill: this.fg }
    })

    this.sctx.text({
      x,
      y: y + 30,
      value: data.word,
      style: { font: `22px "${this.font}"`, fill: this.fg }
    })

    this.sctx.text({
      x,
      y: y + 50,
      value: `${data.category} [${data.pronunciation}]`,
      style: { font: `14px "${this.font}"`, fill: this.fg }
    })
    
    this.sctx.text({
      x,
      y: y + 70,
      value: data.definition.length > 160 ? `${data.definition.substr(0, 160)}...` : data.definition,
      maxWidth,
      style: { font: `16px "${this.font}"`, fill: this.fg }
    })
  }

  async draw() {
    const hasNot = compose(not, hasIn)
    if(!this.wotd || hasNot('word', this.wotd)) {
      winston.log('error', 'Word of the day properties not present')
      return
    }
    this._word(this.wotd)
  }
}
