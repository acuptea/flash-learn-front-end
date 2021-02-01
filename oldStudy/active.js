/**
 * 记录题目
 */

/**
 * 1.自我介绍
 * 2.如何设计好一个组件
 * 3.组件之间传值
 * 4.vuex有什么优点
 * 5.项目中难点是什么
 * 6.webpack做了哪些优化：构建/打包两方面
 * 7.vue响应式原理
 * 8.微任务宏任务 虚拟dom更新节点是宏任务还是微任务
 * 9.虚拟dom什么时候更新dom
 * 10.虚拟dom 对比差异
 * 11.data中 a[0] = 1 页面是否会修改 为什么
 * 12.如果就要a[0] = 1响应应该怎么做
 * 13. $nextTick发生的时间
 * 14.css 动画如何设置
 * 15.rem/em区别
 */

/**
 * 16.以下的输出内容
 * 考察：宏任务、微任务、async也是通过new Promise实现 （疑点：async是通过协程+promise实现
 * (1)promise中 resolve/reject之后的代码 都是在微任务中执行
 * (2)async中：await执行的时候 产生一个promise await之后的代码 需要await执行完毕之后再执行
 * (3)任务执行顺序：当前宏任务执行=>当前宏任务中的微任务执行=>下一个宏任务
 *
 * script start/ async1 start / async2 / promise1 / script end / async1 end /promise2 /setTimeout
 *
 * 执行分析：
 * 这段一段代码属于一个宏任务
 * 打印script start
 * settimeout放到宏任务消息队列中
 * async1执行  打印async1 start
 * 遇到 await 产生一个promise 之后的代码加到微任务中 产生微任务1
 * 执行async2 打印async2
 * 遇到promise 执行resolve的时候 才产生微任务 打印promise1
 * resolve产生一个promise 后面的then是一个微任务 产生微任务2
 * 打印script end
 * 当前宏任务执行完之前 执行宏任务中的微任务1 打印async1 end
 * 执行微任务2 打印promise2
 * 当前宏任务执行完毕
 * 执行下一个宏任务 打印setTimeout
 */

// async function async1() {
// 	console.log("async1 start");
// 	await async2();
// 	console.log("async1 end");
// }
// async function async2() {
// 	console.log("async2");
// }
// console.log("script start");

// setTimeout(function () {
// 	console.log("setTimeout");
// }, 0);

// async1();

// new Promise(function (resolve) {
// 	console.log("promise1");
// 	resolve();
// }).then(function () {
// 	console.log("promise2");
// });
// console.log("script end");

/**
 * 17.以下的输出内容 
 * 考察：1.作用域链由词法作用域决定 2.for(var)不会形成作用域,如果是for(let) let会产生词法作用域
 * 因此 函数运行时 a = 1 i = 3  total += 3 运行了3次 所以是 3 6 9 
 * 3 6 9 
 */
var result = [];
var a = 3;
var total = 0;
function foo(a) {
	var i = 0;
	for (; i < 3; i++) {
		result[i] = function () {
			total += i * a;
			// console.log(total);
		};
	}
}

// foo(1);
// result[0]();
// result[1]();
// result[2]();

/**
 * 18.遍历二叉树 输出路径
 */
function print(root) {
	function tranverse(node, str) {
		if (!node.left && !node.right) {
			console.log(str);
			return;
		}
		str += `,${node.name}`;
		if (node.left) {
			tranverse(node.left, str);
		}
		if (node.right) {
			tranverse(node.right, str);
		}
	}
	tranverse(root, "");
}

/**
 * 19.有什么问题吗
 */


/**
 * 验证一下aynsc有没有用协程
 * 协程不会阻塞主线程的运行
 * 微任务会阻塞
 */

// function testAynscUseCoroutine() {
// 	var testNum = 0

// 	let timer = setInterval(function addNum(){
// 		testNum++
// 		// console.log('宏任务interval：'+testNum)
// 		if(testNum >=15){
// 			clearInterval(timer)
// 		}
// 	},1000)

// 	async function async1() {
// 		console.log("async1 start");
// 		let res = await async2();
// 		console.log('await async2的结果：'+res)
// 		console.log("async1 end");
// 	}
// 	async function async2() {
// 		return new Promise((resolve,reject)=>{
// 			console.log('promise1执行了')
// 			console.log(testNum)
// 			console.log('promise1永远不会执行了吗')
			
// 			let inter2 = setInterval(function forAwaitAsync2(){
// 				if(testNum>=10){
// 					resolve('100')
// 					clearInterval(inter2)
// 				}
// 			},500)
// 		})
// 	}
// 	console.log('testAynscUseCoroutine执行开始')
// 	async1()

// 	new Promise((resolve,reject)=>{
// 		console.log('promise2执行了')
// 		resolve()
// 		console.log('promise2的resolve执行了')
// 	}).then(()=>{
// 		console.log('promise2的resolve的then执行了，当前微任务执行结束')
// 	})

// 	setTimeout(function consoleTimeout1(){
// 		console.log('主线的timeout宏任务1：')
// 	},4000)

// 	setTimeout(function consoleTimeout2(){
// 		console.log('主线的timeout宏任务2：')
// 	},8000)

// 	console.log('testAynscUseCoroutine执行结束')
// }

// testAynscUseCoroutine()
// 



async function foo() {
	return foo()
	// return setTimeout(()=>{
	// 	foo()
	// })
	// return new Promise((resole)=>{
	// 	resole()
	// }).then((res)=>{
	// 	foo()
	// })
	// return await foo()
}

foo()
let ele = document.getElementById('test')
ele.onclick = function(e) {
	console.log('触发了click')
}
// async function testA() {
// 	let test = await testA()
// }
// 




/**
 * 1.富文本如何优化的=>富文本用其他方式实现  createElement div textContent innerHtml
 * 2.聊天如何实现的 h5页面与app如何交互  JS brige实现的原理
 * 3.getters 修改state 效率
 */

/**
 * 实现如下函数add,使如下执行都等于9
add(2,3,4)=9
add(2)(3,4)=9
add(2)(3)(4)=9
add(2,3)(4)=9
 */
function add() {
    let beforeArgs = [...arguments]
    if(beforeArgs.length === 3){
        let count = 0
        beforeArgs.forEach(item=> count+=item)
        return count
    } else {
        return  function() {
            let activeArgs = [...arguments]
            return add(...beforeArgs,...activeArgs)
        }
    }
}

/**
 * 封装一个autocomplete组件  更通用的                                               
 *
 * 1.props 参数： method params url pagesize
2. <slot name="content"></slot>
3.请求加一个防抖
4.保证数据格式 data:[] 字段
 */

/**
 * arr: [,3,3,2,2,4,3,4,5] target: 8
 */

/**
 * 设计一个简单的链式调用，要求分别在1，3，4秒后打印出”1”, “2”, “3”
new Queue()
.task(1000, () => {console.log(1)})
.task(2000, () => {console.log(2)})
.task(1000, () => {console.log(3)})
.start()


请实现一个观察者模式，拥有四个方法on,off,once和trigger
class Event = {
on() {} // 绑定
off() {} // 解绑
once() {} // 绑定一次
trigger() {} // 触发事件
};

const e = new Event()
e.on('a', console.log('a'))
e.on('a', console.log('b'))

e.trigger('a') // 'b'


function Queue() {
    this.timeCount = 0
    this.taskList = []
}
Queue.prototype.task = function(gap,callBack) {
    this.taskList.push({duration:gap,callBack:callBack})
    return Queue.task
}

Queue.prototype.start = function() {
    if(this.taskList.length) {
        const eventObj = this.taskList.shift()
        return new Promise(()=>{
            setTimeout(()=>{
                eventObj.callBack()
                Queue.start()
            },eventObj.duration)
        })
    }
}
 */
