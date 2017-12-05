const { loadImage } = require('canvas')
const R = require('ramda')

module.exports = class Weather {
  constructor(options) {
    this.width = options.width
    this.sctx = options.sctx
    this.data = options.data
    this.x = options.x
    this.y = options.y
    this.color = '#000000'

    this.canvas = options.canvas

  }

  _day(data) {
    return new Promise((resolve, reject) => {


    const dayWidth = this.width * 0.125
    const dayHeight = 80
    const gap = this.width * 0.016

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    data.slice(1, 8).forEach((d, i) => {
      let x = this.x + (i*dayWidth) + (gap * i) + gap
      let fulldate = new Date(d.time*1000)
      let day = dayNames[fulldate.getDay()]

      let dayTxtWidth = this.sctx.measureText({
        value: day,
        style: { font: '12px FiraSans' }
      }).width + 5
      let tempHighTxt = this.sctx.measureText({
        value: Math.round(d.temperatureHigh) + '°',
        style: { font: '11px FiraSans' }
      }).width

      // container
      this.sctx.rect({
        x,
        y: this.y,
        width: dayWidth,
        height: dayHeight,
        style: { strokeWidth: 1, strokeColor: this.color }
      })
      console.log(d)

      // day name
      this.sctx.text({
        x: x + (dayWidth/2) - (dayTxtWidth/2),
        y: this.y + 15,
        value: day,
        style: { font: '12px FiraSans', fill: this.color }
      })

      // min temp
      this.sctx.text({
        x: x + 5,
        y: this.y + 40,
        value: Math.round(d.temperatureLow) + '°',
        style: { font: '11px FiraSans', fill: this.color }
      })

      // max temp
      this.sctx.text({
        x: x + dayWidth - tempHighTxt - 2,
        y: this.y + 40,
        value: Math.round(d.temperatureHigh) + '°',
        style: { font: '11px FiraSans', fill: this.color }
      })

      loadImage(this._getImagePath(d.icon)).then((image) => {
        //console.log(image)
        this.sctx.image({
          image,
          x: x + (dayWidth/2) - 15,
          y: this.y + 50,
          width: 30,
          height: 30
        })
        resolve()
      })

    })

      //console.log(d)
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

    return new Promise((resolve, reject) => {
      loadImage(this._getImagePath(data.icon)).then((image) => {
        this.sctx.image({
          image,
          x: 20,
          y: 20,
          width: 122,
          height: 122
        })
        resolve()
      })
    })
  }

  _getImagePath(icon) {
    const icons = {
      'clear-day': 'sun',
      'clear-night': 'moon',
      'rain': 'rain-cloud',
      'snow': 'snow',
      'sleet': 'sleet',
      'wind': 'wind',
      'fog': 'mist',
      'cloudy': 'cloud',
      'partly-cloudy-day': 'sun-large-cloud',
      'partly-cloudy-night': 'moon-large-cloud',
      'hail': 'hail',
      'thunderstorm': 'thunder',
      'tornado': 'storm'
    }
    const img = R.path([icon], icons)
    const path = './assets/images/weather/'
    const ext = '.png'
    return img ? `${path}${img}${ext}` : `${path}${icons['clear-day']}${ext}`
  }

  async draw() {
    await this._today(this.data.currently)
    this._hour(this.data.hourly.data)
    await this._day(this.data.daily.data)
    return true
  }
}
