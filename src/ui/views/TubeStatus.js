const winston = require('winston')
const { compose, split, head } = require('ramda')

module.exports = class TubeStatus {
  constructor(options) {
    Object.assign(this, options)
  }

  _addText(x, y, value) {
    this.sctx.text({
      y,
      x,
      value,
      align: 'center',
      style: { font: `12px "${this.font}"`, fill: this.fg }
    })
  }

  _addRow(x, y, width, col1, col2) {
    const col1X = x + (width * 0.25)
    const col2X = x + (width * 0.75)


    this._addText(col1X, (y + 13), col1)
    this._addText(col2X, (y + 13), col2)

    this.sctx.line({
      x,
      y: y + 20,
      width,
      style: { strokeColor: this.fg, strokeWidth: 1 }
    })
  }

  _tubeList(statuses) {
    const x = this.x + 24
    const y = this.y + 9
    const width = this.width - 25
    const height = (statuses.length + 1) * 20

    this.sctx.text({
      x,
      y: this.y,
      value: 'Tube Status',
      style: { font: `12px "${this.font}"`, fill: this.fg }
    })

    this.sctx.rect({
      x,
      y,
      width,
      height,
      style: {
        strokeWidth: 1, strokeColor: this.fg
      }
    })

    this.sctx.line({
      x: x + width / 2,
      y,
      height,
      style: { strokeColor: this.fg, strokeWidth: 1 }
    })

    this._addRow(x, y, width, 'Line', 'Status')

    return statuses.reduce((index, { line, status }) => {
      const firstWord = compose(head, split(' '))(line)
      this._addRow(x, y + (index * 20), width, firstWord, status)
      return index + 1
    }, 1)
  }

  async draw() {
    if(!Array.isArray(this.tubeStatus.statuses)) {
      winston.log('error', 'TubeStatus - statuses not array')
      return { height: this.y }
    }
    const height = this._tubeList(this.tubeStatus.statuses)

    return { height: this.y + (height * 20) + 13 }
  }
}