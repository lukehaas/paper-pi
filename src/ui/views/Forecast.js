const { loadImage } = require('canvas')
const path = require('path')
const { path: rPath, compose, not, hasIn } = require('ramda')
const moment = require('moment')
const winston = require('winston')

module.exports = class Forecast {
  constructor(options) {
    Object.assign(this, options)
  }

  _day(data) {
    return new Promise((resolve, reject) => {
      const dayWidth = this.width * 0.12
      const dayHeight = 75
      const gap = this.width * 0.015
      const y = this.y + 130
      const yPos = {
        container: y,
        day: y + 15,
        temp: y + 35,
        image: y + 40
      }

      data.slice(1, 8).forEach((d, i) => {
        const x = this.x + (i*dayWidth) + (gap * i) + gap + 18
        const day = moment.unix(d.time).format('ddd')
        const dayTxtWidth = this.sctx.textWidth({
          value: day,
          style: { font: `12px "${this.font}"` }
        })
        const tempHighTxt = this.sctx.textWidth({
          value: `${Math.round(d.temperatureHigh)}°`,
          style: { font: `11px "${this.font}"` }
        })

        // container
        this.sctx.rect({
          x,
          y: yPos.container,
          width: dayWidth,
          height: dayHeight,
          style: { strokeWidth: 1, strokeColor: this.fg }
        })

        // day name
        this.sctx.text({
          x: x + (dayWidth/2) - (dayTxtWidth/2),
          y: yPos.day,
          value: day,
          style: { font: `12px "${this.font}"`, fill: this.fg }
        })

        // min temp
        this.sctx.text({
          x: x + 2,
          y: yPos.temp,
          value: `${Math.round(d.temperatureLow)}°`,
          style: { font: `11px "${this.font}"`, fill: this.fg }
        })

        // max temp
        this.sctx.text({
          x: x + dayWidth - tempHighTxt - 1,
          y: yPos.temp,
          value: `${Math.round(d.temperatureHigh)}°`,
          style: { font: `11px "${this.font}"`, fill: this.fg }
        })


        loadImage(this._getImagePath(d.icon, false)).then((image) => {
          //console.log(image)
          this.sctx.image({
            image,
            x: x + (dayWidth/2) - 15,
            y: yPos.image,
            width: 30,
            height: 30
          })
          resolve()
        })
        .catch(() => {
          reject('Failed to load image')
        })
      })
    })
  }
  
  _hourColumn(x, y, data) {
    return new Promise((resolve, reject) => {
      const yPos = {
        time: y + 20,
        image: y,
        temp: y + 20
      }
      const xPos = {
        time: x,
        image: x + 40,
        temp: x + 70
      }
      data.forEach((h, i) => {
        // time
        const hour = moment.unix(h.time).format('H:mm')
        this.sctx.text({
          x: xPos.time,
          y: yPos.time + (i*25),
          value: hour,
          style: { font: `11px "${this.font}"`, fill: this.fg }
        })
        // image
        loadImage(this._getImagePath(h.icon, false)).then((image) => {
          this.sctx.image({
            image,
            x: xPos.image,
            y: yPos.image + (i*25),
            width: 25,
            height: 25
          })
          resolve()
        })
        .catch(() => {
          reject('Failed to load image')
        })
        // temperature
        this.sctx.text({
          x: xPos.temp,
          y: yPos.temp + (i*25),
          value: `${Math.round(h.temperature)}°`,
          style: { font: `11px "${this.font}"`, fill: this.fg }
        })
      })
    })
  }

  _hour(data) {
    return new Promise((resolve) => {
      if(data.length < 8) return
      const x = this.x + 178
      const y = this.y

      const colOne = data.slice(1, 6)
      const colTwo = data.slice(6, 11)
      this._hourColumn(x, y, colOne).then(() => {
        this._hourColumn(x + 110, y, colTwo).then(() => {
          resolve()
        })
      })
    })
  }

  _today(data) {
    return new Promise((resolve, reject) => {
      const y = this.y + 20
      const x = this.x + 24
      const yPos = {
        location: y,
        summary: y + 20,
        temp: y + 10,
        image: y + 25
      }
      // Location
      this.sctx.text({
        x,
        y: yPos.location,
        value: 'London',
        style: { font: `16px "${this.font}"`, fill: this.fg }
      })

      //Current weather summary
      this.sctx.text({
        x,
        y: yPos.summary,
        value: data.summary,
        maxWidth: 115,
        style: { font: `12px "${this.font}"`, fill: this.fg }
      })

      // current temperature
      this.sctx.text({
        x: x + 107,
        y: yPos.temp,
        value: `${Math.round(data.temperature)}°`,
        style: { font: `26px "${this.font}"`, fill: this.fg }
      })

      loadImage(this._getImagePath(data.icon, true)).then((image) => {
        this.sctx.image({
          image,
          x,
          y: yPos.image,
          width: 85,
          height: 85
        })
        resolve()
      })
      .catch(() => {
        reject('Failed to load image')
      })
    })
  }

  _getImagePath(icon, today) {
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
    if(today === false && icon === 'partly-cloudy-night') {
      icon = 'clear-day'
    }
    const img = rPath([icon], icons)
    const imgPath = 'assets/images/weather/'
    const ext = '.png'
    return img ? path.join(__dirname, '../../../', `${imgPath}${img}${ext}`) : 
      path.join(__dirname, '../../../', `${imgPath}${icons['clear-day']}${ext}`)
  }

  async draw() {
    const hasNot = compose(not, hasIn)
    if(!this.forecast || hasNot('currently', this.forecast) || hasNot('hourly', this.forecast) || hasNot('daily', this.forecast)) {
      winston.log('error', 'Forecast - forecast properties not present')
      return
    }
    await this._today(this.forecast.currently)
    await this._hour(this.forecast.hourly.data)
    await this._day(this.forecast.daily.data)
    return true
  }
}
