// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Shapely 1.0 - JavaScript Canvas Library                            │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013 Luke Haas (https://lukehaas.me)                   │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    | \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function(global, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define(['b'], factory);
  } else if(typeof module === 'object' && module.exports) {
    module.exports = factory(global);
  } else {
    factory(global);
  }
}(typeof window !== 'undefined' ? window : this, function(window, undefined) {
  var
  version = "1.0",
  guid,
  stack,
  shapely = function( ctx ) {
    return new shapely.fun.init( ctx );
  };
  shapely.fun = shapely.prototype = {
    shapely_version: version,
    constructor: shapely,
    init: function( ctx ) {
      guid = 0;
      stack = [];
      tween.init();
      if ( !ctx ) {
        return this;
      }
      if(Array.isArray(ctx)) {
        return merge( this.constructor(), ctx );
      } else {
        this.length = 1;
        this[0] = ctx;
      }
      return this;
    },
    length:0,
    splice: [].slice
  };
  shapely.fun.init.prototype = shapely.fun;
  function merge(first,second) {
    var l = second.length,
    i = first.length,
    j = 0;

    if ( typeof l === "number" ) {
      for ( ; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }
    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }
    first.length = i;

    return first;
  }
  function extender(base,options) {
    var key;
    for(key in options) {
      if(options.hasOwnProperty(key)) {
        base[key] = options[key];

      }
    }
    return base;
  }
  function diffExtend(base,options) {
    var key,
      diff = {},
      skey;
    for(key in options) {
      if(base.hasOwnProperty(key)) {
        if(key=='style') {
          //diff.style = base.style;
          diff.style = {};
          for(skey in base.style) {
            diff.style[skey] = base.style[skey];
            if(options.style.hasOwnProperty(skey)) {
              diff.style[skey] = options.style[skey];
            }
          }
        } else {
          diff[key] = options[key];
        }
      }
    }
    return diff;
  }

  function hexToRgb(hex) {
    var rgb;
    if(hex.substr(0,3)=="rgb") {
      hex = hex.match(/[0-9]+/g);

      rgb = {
        r:hex[0],
        g:hex[1],
        b:hex[2]
      }
    } else {
      hex = hex.replace(/#/,'');

      var bigint = parseInt(hex, 16);
      rgb = {
        r:(bigint >> 16) & 255,
        g:(bigint >> 8) & 255,
        b:bigint & 255
      };
    }

    return rgb;
  }
  function Shape() {
    this.x = 0;
    this.y = 0;
    // 4 * ((√(2) - 1) / 3)
    this.kappa = 0.5522847498;
    //pi/180
    this.radian = 0.01745329251;
    //(2 * Math.PI) / 10
    this.alpha = 0.6283185307179586;
    this.width = 1;
    this.height = 1;
    this.sides = 1;
    this.dashWidth = 10;
    this.dashGap = 5;
    this.radius = 0;
    this.style = {
      strokeStyle:"solid",
      strokeWidth:1
    }
  }
  Shape.prototype.extend = function(options) {
    var key;
    for(key in options) {
      if(options.hasOwnProperty(key)) {
          if(key=="style" || !isNaN(options[key])) {

            this[key] = options[key];
          }
      }
    }
    if(this.radius==0) {
      this.yrad = this.height/2;
      this.xrad = this.width/2;
    }
    else if(options.polygon) {
      this.yrad = this.xrad = this.radius/2;
    }
    else {
      this.yrad = this.xrad = this.radius;
    }
    if(options.circle) {
      this.ydis = this.yrad*this.kappa;
      this.xdis = this.xrad*this.kappa;
      if(this.radius>0) {
        this.width = this.height = this.radius*2;
      }
    }

    if(options.style) {
      if(options.style.fill) {
        if(options.style.opacity) {
          this.rgb = hexToRgb(options.style.fill);

          options.style.fill = "rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + "," + options.style.opacity + ")";
        }
      }
      if(options.style.strokeColor) {
        if(options.style.opacity) {

          this.rgb = hexToRgb(options.style.strokeColor);
          options.style.strokeColor = "rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + "," + options.style.opacity + ")";
        }
      }
      if(options.style.pattern) {
        this.img = options.style.pattern;
      }
    }
    if(options.rotation) {
      //this.x -= this.tranx = this.x + (this.xrad/2);
      //this.y -= this.trany = this.y + (this.yrad/2);
      this.x -= this.tranx = this.x + this.xrad;
      this.y -= this.trany = this.y + this.yrad;
    }
    if(options.cornerRadius) {
      this.radFactor = options.cornerRadius*0.449;
    }
  }

  function applyStyle(elem,style,shape) {
    if(style.shadow) {
      elem.shadowOffsetX = style.shadow.offsetX;
      elem.shadowOffsetY = style.shadow.offsetY;
      elem.shadowBlur = style.shadow.blur;
      elem.shadowColor = style.shadow.color;
    }
    if(style.fillGradient) {

      style.fill = initGradient(elem,style.fillGradient);
    }
    if(style.strokeGradient) {
      style.strokeColor = initGradient(elem,style.strokeGradient);
    }
    if(style.pattern) {
      var ptrn = elem.createPattern(shape.img,'repeat');
      style.fill = ptrn;
    }
    if(style.fill) {
      elem.fillStyle = style.fill;
      if(!shape.text)
      elem.fill();
    }
    if(style.strokeColor) {
      elem.strokeStyle = style.strokeColor;
      elem.lineWidth = style.strokeWidth;
      if(!shape.text)
      elem.stroke();
    }
  }
  function initGradient(elem,gradient) {
    var grad,
      i,
      l;
    i = l = 0;
    if(gradient.type=="linear") {
      grad = elem.createLinearGradient(gradient.positions.x1,
        gradient.positions.y1,
        gradient.positions.x2,
        gradient.positions.y2);

    } else if(gradient.type=="radial") {
      grad = elem.createRadialGradient(gradient.positions.x1,
        gradient.positions.y1,
        gradient.positions.r1,
        gradient.positions.x2,
        gradient.positions.y2,
        gradient.positions.r2);
    }
    l = gradient.colors.length;
    for(;i<l;i++) {
      grad.addColorStop(gradient.colors[i][0],gradient.colors[i][1]);
    }

    return grad;
  }
  function customShape(shape,elem) {
    var k = 0,
      angle = (360/shape.sides);

    elem.moveTo(shape.x,shape.y);

    for (; k <shape.sides; k++) {
      elem.lineTo(shape.x+=Math.cos( ( angle * k )*shape.radian) * shape.radius, shape.y+=Math.sin( ( angle * k )*shape.radian) * shape.radius);
    }
  }

  shapely.fun.star = function() {
    var i = 0,
      l = this.length,
      shape,
      elem,
      options = arguments[0] || {};
    //.log(options);

    shape = new Shape();
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawStar,options:options,animation:false};

    for(;i<l;i++) {
      elem = this[i] || {};

      drawStar(elem,shape,options);
    }
    return this;
  }
  shapely.fun.triangle = function() {
    var i = 0,
      l = this.length,
      shape,
      elem,
      options = arguments[0] || {};

    options.sides = 3;
    options.polygon = 1;
    shape = new Shape();
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawTriangle,options:options,animation:false};
    for(;i<l;i++) {
      elem = this[i] || {};

      drawTriangle(elem,shape,options);
      }
    return this;
  }
  shapely.fun.line = function() {
    var i = 0,
      l = this.length,
      shape,
      elem,
      vertical = true,
      options = arguments[0] || {};

    shape = new Shape();
    shape.extend(options);
    shape.length = Math.max(shape.width,shape.height);
    shape.vertical = true;
    if(shape.width>shape.height) {
      shape.vertical = false;
    }
    stack[guid++] = {shape:shape,method:drawLine,options:options,animation:false};

    for(;i<l;i++) {
      elem = this[i] || {};

      drawLine(elem,shape,options);
    }
    return this;
  }
  shapely.fun.polygon = function() {
    var i = 0,
      l = this.length,
      shape,
      elem,
      options = arguments[0] || {};

    options.polygon = 1;
    shape = new Shape();
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawPolygon,options:options,animation:false};

    for(;i<l;i++) {
      elem = this[i] || {};

      drawPolygon(elem,shape,options)

      }
    return this;
  }

  shapely.fun.image = function() {
    var i = 0,
      l = this.length,
      elem,
      options = arguments[0] || {},
      shape = new Shape();
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawImage,options:options,animation:false};
    for(;i<l;i++) {
      elem = this[i] || {};

      drawImage(elem,shape,options);

    }

    return this;
  }

  shapely.fun.circle = function() {
    var i = 0,
      l = this.length,
      shape,
      elem,
      options = arguments[0] || {};

    options.circle = 1;
    shape = new Shape();
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawCircle,options:options,animation:false};

    for(;i<l;i++) {
      elem = this[i] || {};

      drawCircle(elem,shape,options);
    }
    return this;

  }
  shapely.fun.text = function() {
    var i = 0,
    l = this.length,
    elem,
    options = arguments[0] || {},
    shape = new Shape();
    options.text = 1;
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawText,options:options,animation:false};
    for(;i<l;i++) {
      elem = this[i] || {};

      drawText(elem,shape,options);
    }
    return this;
  }
  shapely.fun.rect = shapely.fun.rectangle = function() {
    var i = 0,
      l = this.length,
      shape,
      elem,
      options = arguments[0] || {};

    shape = new Shape();
    shape.extend(options);

    stack[guid++] = {shape:shape,method:drawRectangle,options:options,animation:false};

    for(;i<l;i++) {
      elem = this[i] || {};

      drawRectangle(elem,shape,options);
      }
    return this;
  }

  function drawLine(elem,shape,options) {
    var space,
      end,
      dashPosition;

    elem.save();

    if(options.rotation) {

      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);
    }
      elem.beginPath();
      elem.moveTo(shape.x, shape.y);

    if(options.style.strokeStyle=="dashed") {
      space = false;
      if(shape.vertical) {
        dashPosition = shape.y;
        end = shape.length + shape.y;
        while(dashPosition<end) {
          if(space) {
            elem.moveTo(shape.x,dashPosition+=shape.dashGap);
          } else {

            if((dashPosition+=shape.dashWidth)>end) {

              elem.lineTo(shape.x,end);
            } else {
              elem.lineTo(shape.x,dashPosition);
            }

          }
          space = !space;
        }
      } else {
        dashPosition = shape.x;
        end = shape.length + shape.x;
        while(dashPosition<end) {
          if(space) {
            elem.moveTo(dashPosition+=shape.dashGap,shape.y);
          } else {
            if((dashPosition+=shape.dashWidth)>end) {
              elem.lineTo(end,shape.y);
            } else {
              elem.lineTo(dashPosition,shape.y);
            }

          }
          space = !space;
        }
      }
    } else {

      if(shape.vertical) {
        elem.lineTo(shape.x,shape.y+shape.length);
      } else {
        elem.lineTo(shape.x+shape.length,shape.y);
      }
    }

    elem.closePath();
    if(options.style) {
      applyStyle(elem,options.style,shape);
    }

    elem.restore();
  }
  function drawImage(elem,shape,options) {
    elem.save();
    if(options.rotation) {

      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);
    }
    if(options.image) {
      if(options.sx && options.sy && options.swidth && options.sheight) {
        elem.drawImage(options.image,options.sx,options.sy,options.swidth,options.sheight,shape.x,shape.y,shape.width,shape.height);
      } else {
        elem.drawImage(options.image,shape.x,shape.y,shape.width,shape.height);
      }
    }
    if(options.style) {
      applyStyle(elem,options.style,shape);
    }

    elem.restore();
  }
  function drawText(elem,shape,options) {
    elem.save();

    if(options.rotation) {

      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);
    }

    if(options.align) {
      elem.textAlign = options.align;
    }
    if(options.baseline) {
      elem.textBaseline = options.baseline;
    }

    if(options.style) {
      applyStyle(elem,options.style,shape);
      if(options.style.font) {

        elem.font = options.style.font;
      }
      if(options.style.fill) {

        elem.fillText(options.value,shape.x,shape.y);
      }
      if(options.style.strokeColor) {

        elem.strokeText(options.value,shape.x,shape.y);
      }
    }

    elem.restore();
  }
  function drawTriangle(elem,shape,options) {
    elem.save();

    if(options.rotation) {
      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);
    }

      elem.beginPath();

    customShape(shape,elem);

      elem.closePath();

    if(options.style) {
      applyStyle(elem,options.style,shape);
    }
    elem.restore();
  }
  function drawPolygon(elem,shape,options) {
    elem.save();

    if(options.rotation) {
      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);
    }

      elem.beginPath();

      customShape(shape,elem);

      elem.closePath();

    if(options.style) {
      applyStyle(elem,options.style,shape);
    }
    elem.restore();
  }

  function drawStar(elem,shape,options) {
    var k = 11,
      ra,
      r_point = shape.radius * 2, // r_point is the radius to the external point,
      omega;

    elem.save();

    if(options.rotation) {
      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);

    }
    elem.beginPath();

    elem.moveTo(shape.x+(r_point * Math.sin(shape.alpha*k)),shape.y+ (r_point * Math.cos(shape.alpha*k)));
    for(; k != 0; k--) {
      ra = k % 2 == 1 ? r_point: shape.radius;

      omega = shape.alpha * k; //omega is the angle of the current point
        //cx and cy are the center point of the star.

      elem.lineTo(shape.x + (ra * Math.sin(omega)), shape.y + (ra * Math.cos(omega)));

    }

    elem.closePath();

    if(options.style) {
      applyStyle(elem,options.style,shape);
    }
    elem.restore();
  }
  function drawCircle(elem,shape,options) {

    elem.save();

    if(options.rotation) {

      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);

    }

    elem.beginPath();
    elem.moveTo(shape.width+shape.x, shape.yrad+shape.y);

    elem.bezierCurveTo(shape.width+shape.x, shape.yrad + shape.ydis + shape.y, shape.xrad + shape.xdis + shape.x, shape.height+shape.y, shape.xrad+shape.x, shape.height+shape.y);

    elem.bezierCurveTo(shape.xrad-shape.xdis+shape.x, shape.height+shape.y, shape.x, shape.yrad + shape.ydis + shape.y, shape.x, shape.yrad+shape.y);

    elem.bezierCurveTo(shape.x, shape.yrad-shape.ydis+shape.y, shape.xrad-shape.xdis+shape.x, shape.y, shape.xrad+shape.x, shape.y);

    elem.bezierCurveTo(shape.xrad + shape.xdis + shape.x, shape.y, shape.width+shape.x, shape.yrad-shape.ydis+shape.y, shape.width+shape.x, shape.yrad+shape.y);


    elem.closePath();

    if(options.style) {
      applyStyle(elem,options.style,shape);
    }

    elem.restore();
  }

  function drawRectangle(elem,shape,options) {
    elem.save();

    if(options.rotation) {
      elem.translate(shape.tranx,shape.trany);
      elem.rotate(options.rotation*shape.radian);
    }
    elem.beginPath();

    if(options.cornerRadius) {

    elem.moveTo(shape.width+shape.x, shape.height+shape.y-options.cornerRadius);

    elem.bezierCurveTo(shape.width+shape.x, shape.height+shape.y-shape.radFactor, shape.width+shape.x-shape.radFactor, shape.height+shape.y, shape.width+shape.x-options.cornerRadius, shape.height+shape.y);

    elem.lineTo(shape.x+options.cornerRadius, shape.height+shape.y);

    elem.bezierCurveTo(shape.x+shape.radFactor, shape.height+shape.y, shape.x, shape.height+shape.y-shape.radFactor, shape.x, shape.height+shape.y-options.cornerRadius);

    elem.lineTo(shape.x, shape.y+options.cornerRadius);

    elem.bezierCurveTo(shape.x, shape.y+shape.radFactor, shape.x+shape.radFactor, shape.y, shape.x+options.cornerRadius, shape.y);

    elem.lineTo(shape.width+shape.x-options.cornerRadius, shape.y);

    elem.bezierCurveTo(shape.width+shape.x-shape.radFactor, shape.y, shape.width+shape.x, shape.y+shape.radFactor, shape.width+shape.x, shape.y+options.cornerRadius);

    elem.lineTo(shape.width+shape.x, shape.height+shape.y-options.cornerRadius);


    } else {
      elem.rect(shape.x,shape.y,shape.width,shape.height);
    }

    elem.closePath();

    if(options.style) {
      applyStyle(elem,options.style,shape);
    }

    elem.restore();
  }



/*moofx rewrite */

shapely.fun.animate = function() {

  var options = arguments[0] || {};

  options.duration = arguments[1] || 1000;
  options.transition = Transitions[arguments[2]] || Transitions.easeInOutSine;
  options.onComplete = arguments[3] || function(){};
  options.elems = this;
  options.elemsLength = this.length;
  options.sub = guid-1;


  tween.setOptions(options);
  stack[guid-1].diff = diffExtend(stack[guid-1].options,options);

  stack[guid-1].animation = true;


  tween.custom(stack[guid-1].options,stack[guid-1].diff);

  return this;
}

var tween = {

  init:function() {

    this.i = 0;
    this.options = [];
    this.timer = [];
    this.time = [];
    this.from = [];
    this.to = [];
    this.dimension = [];
    this.now = [];
    this.cTime = [];
    this.queue = [];
  },

  setOptions: function(options){
    this.options[this.i++] = extender({
      onStart: function(){},
      onComplete: function(){},
      transition: Transitions.easeInOutSine,
      duration: 1000,
      wait: true,
      fps: 50,
      active: true
    }, options || {});

  },

  step: function(){

    var time = new Date().getTime(),
      i = 0,
      l = this.options.length;

    for(;i<l;i++) {
      if (time < this.time[i] + this.options[i].duration){
        this.cTime[i] = time - this.time[i];
        this.setNow(false,i);
      } else if(this.options[i].active) {

        setTimeout(this.options[i].onComplete.bind(this), 10);
        this.clearTimer(i);
        this.setNow(true,i);

      }
      this.increase(i);
    }
  },

  setNow: function(finish,z){

    var i = 0;

    if(finish) {
      for(;i<this.to[z].length;i++) {
        this.now[z][this.dimension[z][i]] = this.to[z][i];
      }
    } else {
      for(;i<this.to[z].length;i++) {
        if(this.dimension[z][i]=='style') {

          this.now[z][this.dimension[z][i]] = this.computeStyle(this.from[z][i], this.to[z][i],z);
        } else {
          this.now[z][this.dimension[z][i]] = this.compute(this.from[z][i], this.to[z][i],z);
        }
      }
    }

  },

  compute: function(from, to, i){

    var change = to - from;

    return this.options[i].transition(this.cTime[i], from, change, this.options[i].duration);
  },

  computeStyle: function(from, to, i) {

    var key,
      change,
      newStyle = from;
    for(key in to) {
      if(typeof to[key] == "number") {
        change = to[key] - from[key];
        newStyle[key] = Transitions.linear(this.cTime[i], from[key], change, this.options[i].duration);
      }

    }
    return newStyle;
  },

  clearTimer: function(i){
    clearInterval(this.timer[i]);
    this.timer[i] = null;
    this.options[i].active = false;
    return this;
  },

  _start: function(from,to){

    var key,
      i = this.i-1;
    if (!this.options[i].wait) this.clearTimer(i);
    if (this.timer[i]) return;

    setTimeout(this.options[i].onStart.bind(this), 10);

    this.from[i] = [];
    this.to[i] = [];
    this.dimension[i] = [];

    this.now[i] = from;

    for(key in to) {
      this.from[i].push(from[key]);
      this.to[i].push(to[key]);
      this.dimension[i].push(key);
    }

    this.time[i] = new Date().getTime();
    this.timer[i] = setInterval(this.step.bind(this), Math.round(1000/this.options[i].fps));


    return this;

  },

  custom: function(from,to) {

    return this._start(from,to);
  },

  clearCanvas: function(elem) {
    elem.clearRect(0,0,elem.canvas.width,elem.canvas.height);
  },

  setStyle: function(v,k) {

    var i,z,sub;
    i = z = 0;
    sub = this.options[k].sub;
    for(;z<this.options[k].elemsLength;z++) {


      this.clearCanvas(this.options[k].elems[z]);
      i = 0;
      for(;i<guid;i++) {
        if(stack[i].animation) {

          if(i==sub) {

            this.queue[sub] = {v:v,stack:stack[i]};
            stack[i].shape.extend(v);

            stack[i].method(this.options[k].elems[z],stack[i].shape,v);

          } else if(this.queue[i]) {

            this.queue[i].stack.shape.extend(this.queue[i].v);

            this.queue[i].stack.method(this.options[k].elems[z],this.queue[i].stack.shape,this.queue[i].v);
          }

        } else{
          stack[i].method(this.options[k].elems[z],stack[i].shape,stack[i].options);
        }

      }

    }

  },

  increase: function(i){
    this.setStyle(this.now[i],i);
  }

};

//Transitions (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), BSD License.
var Transitions = {
  //t - start time, b - start value, c - change, d - duration
  linear: function(t, b, c, d) { return c*t/d + b; },
  easeInQuad: function(t, b, c, d) { return c*(t/=d)*t + b; },
  easeOutQuad: function(t, b, c, d) { return -c *(t/=d)*(t-2) + b; },
  easeInOutQuad: function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b; },
  easeInCubic: function(t, b, c, d) { return c*(t/=d)*t*t + b; },
  easeOutCubic: function(t, b, c, d) { return c*((t=t/d-1)*t*t + 1) + b },
  easeInOutCubic: function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;},
  easeInQuart: function(t, b, c, d) { return c*(t/=d)*t*t*t + b; },
  easeOutQuart: function(t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; },
  easeInOutQuart: function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;},
  easeInQuint: function(t, b, c, d) { return c*(t/=d)*t*t*t*t + b; },
  easeOutQuint: function(t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; },
  easeInOutQuint: function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b; },
  easeInSine: function(t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },
  easeOutSine: function(t, b, c, d) { return c * Math.sin(t/d * (Math.PI/2)) + b; },
  easeInOutSine: function(t, b, c, d) { return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; },
  easeInExpo: function(t, b, c, d) { return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },
  easeOutExpo: function(t, b, c, d) { return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; },
  easeInOutExpo: function(t, b, c, d) { if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b; },
  easeInCirc: function(t, b, c, d) { return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; },
  easeOutCirc: function(t, b, c, d) { return c * Math.sqrt(1 - (t=t/d-1)*t) + b; },
  easeInOutCirc: function(t, b, c, d) { if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; },
  easeInElastic: function(t, b, c, d) { var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; },
  easeOutElastic: function(t, b, c, d) { var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; },
  easeInOutElastic: function(t, b, c, d) { var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; },
  easeInBack: function(t, b, c, d) { if (s == undefined) var s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b; },
  easeOutBack: function(t, b, c, d) { if (s == undefined) var s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; },
  easeInOutBack: function(t, b, c, d) { if (s == undefined) var s = 1.70158;
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; },
  easeInBounce: function(t, b, c, d) { return c - Transitions.easeOutBounce (d-t, 0, c, d) + b; },
  easeOutBounce: function(t, b, c, d) { if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    } },
  easeInOutBounce: function(t, b, c, d) { if (t < d/2) return Transitions.easeInBounce (t*2, 0, c, d) * .5 + b;
    return Transitions.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b; }

};

  window.shapely = shapely;
  return shapely;
}));
