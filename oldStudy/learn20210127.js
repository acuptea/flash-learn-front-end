/**
 * 事件侦听与promise
 */

function Event() {
  this.eventBus = {}
}

Event.prototype.hasEvent = function(eventName) {
  return this.eventBus[eventName] ? true : false
}

Event.prototype.on = function(eventName,listenerFunction,mark,priority) {
  mark = mark || {}
  if(!this.hasEvent(eventName)) {
    this.eventBus[eventName] = {
      callBack: [listenerFunction],
      ...mark
    }
  } else {
     this.eventBus[eventName].callBack.push(listenerFunction)  
  }
}

Event.prototype.once = function(eventName,listenerFunction) {
  this.on(eventName,listenerFunction,{
    once: true
  })
}

Event.prototype.off = function(eventName,listenerFunction) {
  if(listenerFunction) {
    if(this.eventBus[eventName].callBack) {
      let index = this.eventBus[eventName].callBack.findIndex(o=> o == listenerFunction)
      if(index > -1) {
        this.eventBus[eventName].callBack.splice(index,1)
      }
    }
  } else {
    this.eventBus[eventName].callBack = []
  }
}

Event.prototype.trigger = function(eventName) {
  const activeEvent = this.eventBus[eventName]
  if(!activeEvent) return
  if(activeEvent.callBack && activeEvent.callBack.length) {
    activeEvent.callBack.forEach(item=>{
      item()
    })
  } 
  if(activeEvent.once) {
    this.off(eventName)
  }
}

// const test = new Event()

// const handlerOne = function() {
//   console.log('1')
// }

// test.on('testOnce',handlerOne)
// test.on('testOnce',function() {
//   console.log('2')
// })

// test.trigger('testOnce')
// test.off('testOnce',handlerOne)
// test.trigger('testOnce')

class EventByClass {
  constructor() {
    this.eventBus = {}
  }

  hasEvent(eventName) {
     return this.eventBus[eventName] ? true : false
  }

  on(eventName,listenerFunction,mark,priority) {
    mark = mark || {}
    if(!this.hasEvent(eventName)) {
      this.eventBus[eventName] = {
        callBack: [listenerFunction],
        ...mark
      }
    } else {
       this.eventBus[eventName].callBack.push(listenerFunction)  
    }
  }

  off(eventName,listenerFunction) {
    if(listenerFunction) {
    if(this.eventBus[eventName].callBack) {
        let index = this.eventBus[eventName].callBack.findIndex(o=> o == listenerFunction)
        if(index > -1) {
          this.eventBus[eventName].callBack.splice(index,1)
        }
      }
    } else {
      this.eventBus[eventName].callBack = []
    }
  }

  trigger(eventName) {
    const activeEvent = this.eventBus[eventName]
    if(!activeEvent) return
    if(activeEvent.callBack && activeEvent.callBack.length) {
      activeEvent.callBack.forEach(item=>{
        item()
      })
    } 
    if(activeEvent.once) {
      this.off(eventName)
    }
  }

  once(eventName,listenerFunction) {
    this.on(eventName,listenerFunction,{
      once: true
    })
  }

}

const test = new EventByClass()

const handlerOne = function() {
  console.log('1')
}

test.on('testOnce',handlerOne)
test.on('testOnce',function() {
  console.log('2')
})

test.trigger('testOnce')
// test.off('testOnce',handlerOne)
test.trigger('testOnce')

function Queue() {
  this.taskList = []
}

Queue.prototype.task = function(time,callBack) {
  this.taskList.push({
    time:time,
    callBack:callBack
  })
  return this
}

Queue.prototype.start = function () {
   const quene = this.taskList;
  // let result = Promise.resolve()
  let result = new Promise((resolve,reject)=>{
    resolve('22')
  })

  quene.forEach((item) => {
    result = result.then((res) => {
      console.log(res)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(item.callBack());
        }, item.time);
      })
    })
  })
  
  return result
}

let queue = new Queue()

console.log(queue)
queue.task(1000, () => {
  console.log(1) 
  return '33'
})
.task(2000, () => {
  console.log(2 ) 
  return '44'
})
.task(1000, () => {
  console.log(3) 
  return '55'
})
.start()