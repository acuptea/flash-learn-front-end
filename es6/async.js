/**
 * async和await运用了协程吗
 * 每当出现一个新词 就要对新词有疑问  定义很重要
 *
 * 进程 线程 协程
 *
 * 操作系统以进程为单位，分配系统资源(CPU时间片，内存等)，进程是资源分配的最小单位
 * 进程间通过IPC协议通信  什么是IPC通信？
 * 线程是操作系统调度(CPU调度)执行的最小单位 是程序执行的最小单位   进程和线程都可以并发执行  一个进程里面有多个线程 
 * 同一个进程下的线程共享程序的内存空间(包含代码段、数据集、堆等)，以及一些进程级的资源 比如打开文件和信号
 * 
 * 进程维护的是静态资源，线程维护的是动态资源
 *
 * 协程不是被操作系统管理  而是被代码控制的，有称呼为被用户控制的
 * 协程的特点在一个线程中执行
 *
 *
 *
 * 
 */

// let 
// 

/**
 * 捕获async/await的错误
 * 根据node中error-first原则
 */
const awaitWrapper = function (promise) {
  return promise.then(res=> [null,res]).catch(err=>[err,null])
}

function getData(num) {
  return new Promise((resolve,reject)=>{
    if(num === 0) {
      reject(num)
    } else {
      resolve(num)
    }
  })
}

async function testCatchError(a) {
  const res = await awaitWrapper(getData(a))
  console.log(res)
}

testCatchError(0)