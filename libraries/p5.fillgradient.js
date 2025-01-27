/*!
    p5.fillGradient - MIT License
    Copyright (c) 2022 Jorge Moreno, @alterebro
    Modificata da Emma Troni seguendo le regole descritte qui: https://p5js.org/contribute/creating_libraries/
    */

    (function () {

        'use strict';
      
        p5.prototype.fillGradient = function (type = 'linear', props = {}, context = false) {
      
          let _defaults = {
      
            'linear': {
              from: [0, 0], // x, y
              to: [this.width, this.height], // x, y
              steps: [this.color(255), this.color(0, 96, 164), this.color(0)] // this.color || [this.color, float]
            },
            'radial': {
              from: [this.width / 2, this.height / 2, 0], // x, y, radius
              to: [this.width / 2, this.height / 2, this.max(this.width / 2, this.height / 2)], // x, y, radius
              steps: [this.color(255), this.color(0, 96, 164), this.color(0)]
            },
            'conic': {
              from: [this.width / 2, this.height / 2, 90], // x, y, angle(degrees)
              steps: [this.color(255), this.color(0, 96, 164), this.color(0)]
            }
          }
      
          let _type = type.toLowerCase();
          _type = (!!_defaults[_type]) ? _type : 'linear'
      
          let _props = Object.assign(_defaults[_type], props);
          let _ctx = (!context) ? this.canvas.getContext("2d") : context.canvas.getContext('2d');
      
          let _gradients = {
      
            'linear': () => _ctx.createLinearGradient(
              _props.from[0], _props.from[1],
              _props.to[0], _props.to[1]
            ),
            'radial': () => _ctx.createRadialGradient(
              _props.from[0], _props.from[1], _props.from[2],
              _props.to[0], _props.to[1], _props.to[2]
            ),
            'conic': () => _ctx.createConicGradient(
              radians(_props.from[2]), _props.from[0], _props.from[1],
            )
          }
      
          let _gradient = (_gradients[_type])();
      
          _props.steps.forEach((step, i) => {
      
            let _step = !Array.isArray(step) ? [step] : step
            let _stop = !!_step[1] ? _step[1] : (i / (_props.steps.length - 1));
            _stop = Math.min(1, Math.max(0, _stop));
      
            _gradient.addColorStop(_stop, _step[0])
      
          });
      
          _ctx.fillStyle = _gradient;
        }
      
      })();