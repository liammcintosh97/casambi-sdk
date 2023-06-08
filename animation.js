class Animation {
  constructor(value1,value2,duration,repeat,bounce,onDraw){
    this.value1 = value1
    this.value2 = value2
    this.duration = duration
    this.repeat = repeat
    this.bounce = bounce
    this.onDraw = onDraw

    this.currentValue = value1
    this.currentBounce = false
    this.timer = null
    this.startTime = null
    this.timePassed = null
  }

  stop = ()=>{
    clearInterval(this.timer)
    this.startTime = null
  }

  start = ()=>{
    this.startTime = Date.now();

    this.timer = setInterval(()=> {
      if (this.timePassed >= this.duration) {
        if(this.repeat){
          this.startTime = Date.now();
          this.currentValue = this.value1
        }
        else{
          clearInterval(this.timer); // finish the animation after 2 seconds
          return;
        }

        if(this.bounce) this.currentBounce = !this.currentBounce
      }
    
      // draw the animation at the moment timePassed
      if(this.onDraw){
        const value = this.currentBounce ? (this.value2 - this.currentValue) : this.currentValue
        this.onDraw(value)
      }

      this.timePassed = Date.now() -  this.startTime;
      this.currentValue = this.easeInOutQuint((this.timePassed / this.duration))
    
    }, 20);
  }

  easeInOutCirc(x) {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }

  easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

}

export default Animation