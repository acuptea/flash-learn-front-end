/**
 * Concept （概念）、Teach （教给别人）、Review （回顾）、Simplify （简化）
 * 
 * 什么是promise
 *
 * promise是微任务==》什么时候触发的微任务
 * promise可以链式调用==》如何做到链式调用的
 * promise是为了解决回调地狱的
 * promise是为了解决更小颗粒的任务的
 * promise是一个函数 函数是特殊的对象
 *
 * promise约定了一件事情完成后，成功之后后续做什么事情，失败之后后续做什么事情。 通过new Promise的方式发起一件事情。
 * 事情有三个状态 pengding 等待完成中  resolve成功 reject失败
 * .then中的事情是成功后要做的事情 
 * .catch中的事情是失败后要做的事情 
 * 第一件事情或者之后的事情失败后 会被距离最近的catch拦截住错误  中间的事情就会被忽略掉  catch之后的事情不管  
 *
 *
 * 不管是catch还是then都可以通过return返回一个值给下一个事情
 * 
 *
 * promise有哪些场景可以用  链式调用/异步任务
 * 
 */

// const promise_ = new Promise((resolve,reject)=>{
//   console.log('同步执行的')
//   resolve(11)
// })
// .then((res)=>{
//   console.log(res)
//   return Promise.reject('后面的then执行勒妈')
// })
// .then((test)=>{
//   return Promise.reject('3333')
// })
// .catch((err)=>{
//   console.log(err)
//   console.log('进入错误了吗')
//   return '44444'
// })
// .then((res)=>{
//   console.log(res)
//   console.log('穿透了res')
// })
// .catch(()=>{
//   console.log('catch了哦')
// })

// console.log('宏观任务')

/**
 * 使用Promise实现红绿灯交替重复亮
 * 红灯3秒亮一次，黄灯2秒亮一次，绿灯1秒亮一次；如何让三个灯不断交替重复亮灯？（用Promise实现）三个亮灯函数已经存在
 * 
 * 红 11 黄 1 绿   
 */
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}

function light() {
  let resolve = Promise.resolve().then(()=>{
    return new Promise((resolve)=>{
      setTimeout(()=>{
        red()
        resolve()
      },3000)
    })
  }).then((res)=>{
    // return new Promise((resolve,reject)=>{
    //   setTimeout(()=>{
    //     yellow()
    //     reject('1111')
    //   },2000)
    // })
    return Promise.reject('1111')
  })
  .then((res)=>{
    console.log('影响catch前面的代码执行吗')
    return new Promise((resolve)=>{
      console.log('这个和疑问句一起执行的')
      setTimeout(()=>{
        green()
        resolve()
      },2000)
    })
  })
  .then((res)=>{
    console.log('影响catch前面的代码执行吗22')
  })
  // .catch((err)=>{
  //   console.log('捕获到了错误')
  //   console.log(err)
  // })
  .then(()=>{
    console.log('影响catch后面的代码执行吗')
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve()
        // light()
      },0)
    })
  }).catch((err)=>{
    console.log('捕获到了错误')
    console.log(err)
  })

  return resolve
}

// light()


/**
 * 设计一个简单的链式调用，要求分别在1，3，4秒后打印出”1”, “2”, “3”
new Queue()
.task(1000, () => {console.log(1)})
.task(2000, () => {console.log(2)})
.task(1000, () => {console.log(3)})
.start()
 */


class Queue {
  constructor( ) {
    this.taskList = []
  }

  task(time,callBack) {
    this.taskList.push({
      time,
      callBack
    })
    return this
  }

  start() {
    let resolvedPromise = Promise.resolve()
    for(let i = 0;i<this.taskList.length;i++) {
      const item = this.taskList[i]
      resolvedPromise = resolvedPromise.then(()=>{
        return new Promise((resolve)=>{
          setTimeout(()=>{
            resolve(item.callBack())
          },item.time)
        }) 
      })
    }
  }
}

// const test = new Queue()
// .task(1000, () => {console.log(1)})
// .task(2000, () => {console.log(2)})
// .task(1000, () => {console.log(3)})
// .start()


/**
 * promise.race promise.all
 */

class myPromise {
  constructor() {
    let status = '111'
  }
  then() {
    console.log(status)
    console.log(22222222222)
  }
}

// function myPromise(fn) {
//   let status = 'pending'
//   let taskList = []
//   let this.
//   console.log(this.resolve)
//   console.log(this.reject)

//   fn(this.resolve,this.reject)
// }

// myPromise.prototype.then = function() {

//   return this
// }
// myPromise.prototype.catch = function() {

//   return this
// }
// myPromise.prototype.resolve = function(newValue) {
//   console.log(newValue)
// }
// myPromise.prototype.reject = function(newValue) {

// }



let testMyPromise = new myPromise((resolve,reject)=>{
  console.log(this)
  setTimeout(()=>{
    resolve(222222)
  },1000)
}).then()

// const normalPromise = new Promise((resolve,reject)=>{
//   console.log(resolve)
//   resolve(11,22)
// }).then((res,res2)=>{
//   console.log(res,res2)
// })

// new Promise((resolve,reject)=>{
//   // 
// })
