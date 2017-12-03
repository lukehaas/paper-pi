
module.exports = class Weather {
  constructor(options) {
    this.width = options.width
    this.sctx = options.sctx
    this.data = options.data
    this.x = options.x
    this.y = options.y
  }

  _day(data) {
    const dayWidth = this.width * 0.13
    const dayHeight = 50
    const gap = this.width * 0.1
    
    data.forEach((d, i) => {
      
      this.sctx.rect({
        x: this.x + (i*dayWidth) + gap,
        y: this.y,
        width: dayWidth,
        height: dayHeight,
        style: { border: '' }
      })

      this.sctx.text({

      })

      this.sctx.text({

      })
      console.log(d)
      // summary, icon, temperatureLow, temperatureHigh
    })
  }

  _hour(data) {
    if(data.length < 5) return
    data.slice(2, 5).forEach((h, i) => {

      this.sctx.text({

      })

    })
  }

  _today(data) {
    // data.summary
    // data.icon
    // data.temperature
    this.sctx.text({

    })
  }

  draw() {
    this._today(this.data.currently)
    this._hour(this.data.hourly.data)
    this._day(this.data.daily.data)
    //console.log(this)
  }
}
