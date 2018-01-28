const winston = require('winston')
const { compose, not, hasIn } = require('ramda')

module.exports = class Wotd {
  constructor(options) {
    Object.assign(this, options)
  }

  _word(data) {
    const x = this.x + 8
    const y = this.y + 18
    this.sctx.text({
      x,
      y,
      value: 'Word of the Day',
      style: { font: `12px "${this.font}"`, fill: this.fg }
    })

    this.sctx.text({
      x,
      y: y + 20,
      value: data.word,
      style: { font: `20px "${this.font}"`, fill: this.fg }
    })

    this.sctx.text({
      x,
      y: y + 40,
      value: `${data.category} [${data.pronunciation}]`,
      style: { font: `12px "${this.font}"`, fill: this.fg }
    })

    this.sctx.text({
      x,
      y: y + 60,
      value: data.definition,
      maxWidth: this.width/2,
      style: { font: `12px "${this.font}"`, fill: this.fg }
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
