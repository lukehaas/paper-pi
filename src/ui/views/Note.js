module.exports = class Note {
  constructor(options) {
    Object.assign(this, options)
  }

  async draw() {

    this.sctx.text({
      x: this.x,
      y: this.y,
      value: 'Blah blah note',
      maxWidth: 100,
      style: {
        font: `13px "${this.font}"`, fill: this.fg
      }
    })
  }
}
