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
 * 第一件事情或者之后的事情失败后 会被距离最近的catch拦截住错误  
 * catch不影响后面.then事情的执行 因为后面的事情是否执行是与第一件事情约定的
 *
 * 不管是catch还是then都可以通过return返回一个值给下一个事情
 * 
 *
 * promise有哪些场景可以用  链式调用/异步任务
 * 
 */

console.log(Promise)

// const promise_ = new Promise((resolve,reject)=>{
//   resolve(11)
// })
// .then((res)=>{
//   console.log(res)
//   return Promise.reject('后面的then执行勒妈')
// })
// .then((test)=>{
//   console.log(test)
//   console.log(222)
//   // return Promise.reject('3333')
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

const light = function(time,callBack) {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      callBack && callBack()
      resolve()
    },time)
  })
}


const step = function () {
  Promise.resolve()
  .then(()=>{
    light(3000,red)
  })
  .then(()=>{
    light(2000,yellow)
  })
  .then(()=>{
    light(1000,green)
  })
  .then(()=>{
    step()
  })
}

step()

// function light() {
//   this.task = []
// }

// light.prototype.quene = function(time,fn) {
//   this.task.push({
//     time: time,
//     fn: fn
//   })
//   return this
// }

// light.prototype.start = function() {
//   let resolve = Promise.resolve()
//   return new Promise((resolve,reject)=>{

//   })
// }


// function lightBegin() {

// }
