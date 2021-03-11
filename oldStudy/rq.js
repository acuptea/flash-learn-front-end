/**
 * JSONP
 */

function JSONP(src, params, callBack) {
	let ele = document.createElement("script");
	ele.type = "text/javascript";

	let paramsString = "";
	if (params) {
		for (let key in params) {
			paramsString = paramsString
				? `${paramsString}&${key}=${params[key]}`
				: `${key}=${params[key]}`;
		}
	}

	ele.src = `${src}?${paramsString}&${callBack}`;

	document.getElementsByTagName("body")[0].appendChild(ele);
}

/**
 * webpackloader原理
 */

function webpackloader() {
	/**
	 * 1.loader与plugin有何不同
	 *
	 * loader是加载器，让webpack有了处理js以外的文件类型的能力，比如css-loader less-loader babel-loader url-loader
	 * module.exports
	 * loader在module.rules中配置 作为模块的编译规则存在，通过options传参  loader中通过loaderUtils.getOptions(this)获取options 用return或者 this.call来返回编译后的文件
	 *
	 * plugin是插件，扩展webpack的功能，比如压缩打包文件插件 插件监听 webpack生命周期中广播出来的事件 通过 Webpack 提供的 API 改变输出结果
	 * 在 plugins 中单独配置。 类型为数组，每⼀项是⼀个 plugin 的实例
	 * constructor(options) 在构建函数中获取options参数 apply(compiler) webpack调用插件中的apply函数获取compimer实例
	 * compiler.plugin(事件名称, 回调函数)监听到Webpack广播出来的事件。 并且可以通过compiler对象去操作Webpack。
	 */
}

/**
 * 发布订阅事件 event-bus
 *
 * 利用了map的key可以是任意 不局限于字符串
 *
 * let test = new Map()
 * map.set(key,value)
 */

class eventBus {
	constructor() {
		// 储存事件/回调键值对
		this._events = this._events || new Map();
		// 设立监听上限
		this._maxListeners = this._maxListeners || 10;
	}

	emit(tyope, ...args) {
		let handler = this._events.get(type);

		if (Array.isArray(handler)) {
			// 如果是一个数组说明有多个监听者 需要依次触发里面的函数
			for (let i = 0; i < handler.length; i++) {
				if (args.length > 0) {
					handler[i].apply(this, args);
				} else {
					handler[i].call(this);
				}
			}
		} else {
			if (args.length) {
				handler.apply(this, args);
			} else {
				handler.call(this);
			}
		}

		return true;
	}

	on(type, fn) {
		// 获取对应事件名称的函数清单
		let handler = this._events.get(type);

		if (!handler) {
			this._events.set(type, fn);
		} else if (handler && typeof handler === "function") {
			// 如果handler是函数说明只有⼀个监听者 多个监听者我们需要⽤数组储存
			this._events.set(type, [handler, fn]);
		} else {
			handler.push(fn); // 已经有多个监听者,那么直接往数组⾥push函数即可
		}
	}

	remove(type, fn) {
		const handler = this._events.get(type);
		if (!handler) return;

		if (handler && typeof handler === "function") {
			this._events.delete(type, fn);
		} else {
			for (let i = 0; i < handler.length; i++) {
				if (handler[i] === fn) {
					handler.splice(i, 1);

					// 删除后如果长度变为1 由数组改为对象
					if (handler.length === 1) {
						this._events.set(type, handler[0]);
					}
					return true;
				}
			}
		}
	}
}

/**
 * 数组螺旋返回
 */

// let oArr = [
// 	[1,2,3,4,5],
// 	[6,7,8,9,10],
// 	[11,12,13,14,15],
// 	[16,17,18,19,20],
// 	[20,21,22,23,24,25]
// ]

// let newArr = []

// let m = oArr.length //一维
// let n = oArr[0].length // 二维

// for(let i = 0; i< ((Math.min(m,n))/2);i++){
// 	for(let j = i;j<n-i;j++){
// 		newArr.push(oArr[i][j])
// 	}
// 	for(let j = i+1;j<m-i;j++){
// 		newArr.push(oArr[j][(n-1)-i])
// 	}
// 	for(let j = i+1;j<n-i;j++){
// 		newArr.push(oArr[(m-1)-i][(n-1-j)])
// 	}

// 	for(let j = i+1;j<m-1-i;j++){
// 		// console.log(j)
// 		newArr.push(oArr[m-1-j][i])
// 	}
// }

// console.log(newArr)

/**
 * 通用的事件侦听器函数
 *
 */

const eventUtils = {
	addEvent(el, eventName, callBack) {
		if (el.addEventListener) {
			el.addEventListener(eventName, callBack, false);
		} else if (el.attachEvent) {
			el.attachEvent(`on${eventName}`, callBack);
		} else {
			el[`on${eventName}`] = callBack;
		}
	},
	removeEvent(el, eventName, callBack) {
		if (el.removeEventListener) {
			el.removeEventListener(eventName, callBack, false);
		} else if (el.detachEvent) {
			el.detachEvent(`on${eventName}`, callBack);
		} else {
			el[`on${eventName}`] = null;
		}
	},
	getTarget(event) {
		return event.target || event.srcElement;
	},
	// 获取 event 对象的引用，取到事件的所有信息，确保随时能使用 event
	getEvent(event) {
		return event || window.event;
	},
	// 阻止事件冒泡
	stopPropagation(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},
	// 取消事件默认行为
	preventDefault(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},
};

/**
 * apply
 */

Function.prototype.myApply = function (context) {
	if (typeof this !== "function") {
		throw new TypeError("error");
	}

	let result = null;

	context = context || window;

	// 对象调用时，this指向该对象
	context.fn = this;

	let args = arguments.length >= 2 ? arguments[1] : [];
	result = context.fn(...args);

	delete context.fn;

	return result;
};

/**
 * call
 */

Function.prototype.myCall = function (context) {
	if (typeof this !== "function") {
		throw new TypeError("error");
	}

	let result = null;

	context = context || window;

	context.fn = this;

	let args = Array.prototype.slice.call(arguments, 1);
	result = context.fn(...args);
	delete context.fn;

	return result;
};

/**
 * bind
 */

Function.prototype.myBind = function (context) {
	if (typeof this !== "function") {
		throw new TypeError("error");
	}

	let beforeArgs = Array.prototype.slice.call(arguments, 1);
	let F = function () {};
	let _this = this;

	let bound = function () {
		const allArgs = [...beforeArgs, ...arguments];
		return _this.apply(this instanceof F ? this : context, allArgs);
	};

	F.prototype = _this.prototype;
	bound.prototype = new F();

	return bound;
};

/**
 * 简版bind
 */

Function.prototype.easyBind = function (context) {
	var _this = this;
	// var beforeArgs = Array.from(arguments).slice(1)
	var beforeArgs = [...arguments].slice(1);
	return function () {
		var activeArgs = [...beforeArgs, ...arguments];
		return _this.apply(context, activeArgs);
	};
};

function test(a, b, c) {
	console.log(arguments);
	console.log(Array.prototype.slice.call(arguments, 1));
	// console.log([...arguments])
}
// test(1, 2, 3);

/**
 * promise
 */

function myPromise(fn) {
	let state = "pending";
	let value = null;
	const callbacks = [];

	function handle(callback) {
		if (state === "pending") {
			callbacks.push(callback);
			return;
		}

		const cb =
			state === "fulfilled" ? callback.onFulfilled : callback.onRejected;
		const next = state === "fulfilled" ? callback.resolve : callback.reject;

		if (!cb) {
			next(value);
			return;
		}
		try {
			const ret = cb(value);
			next(ret);
		} catch (e) {
			callback.reject(e);
		}
	}
	function resolve(newValue) {
		const fn = () => {
			if (state !== "pending") return;

			if (
				newValue &&
				(typeof newValue === "object" || typeof newValue === "function")
			) {
				const { then } = newValue;
				if (typeof then === "function") {
					// newValue 为新产生的 myPromise,此时resolve为上个 myPromise 的resolve
					// 相当于调用了新产生 myPromise 的then方法，注入了上个 myPromise 的resolve 为其回调
					then.call(newValue, resolve, reject);
					return;
				}
			}
			state = "fulfilled";
			value = newValue;
			handelCb();
		};

		setTimeout(fn, 0);
	}
	function reject(error) {
		const fn = () => {
			if (state !== "pending") return;

			if (error && (typeof error === "object" || typeof error === "function")) {
				const { then } = error;
				if (typeof then === "function") {
					then.call(error, resolve, reject);
					return;
				}
			}
			state = "rejected";
			value = error;
			handelCb();
		};
		setTimeout(fn, 0);
	}
	function handelCb() {
		while (callbacks.length) {
			const fn = callbacks.shift();
			handle(fn);
		}
	}

	// 执行fn
	fn(resolve, reject);
}
myPromise.prototype.then = function (onFulfilled, onRejected) {
	return new myPromise((resolve, reject) => {
		handle({
			onFulfilled,
			onRejected,
			resolve,
			reject,
		});
	});
};
myPromise.prototype.catch = function (onError) {
	this.then(null, onError);
};
myPromise.prototype.finally = function (onDone) {
	this.then(onDone, onError);
};

// 类似 myPromise(resolve,undefined)
myPromise.prototype.resolve = function (value) {
	if (value && value instanceof myPromise) {
		return value;
	}
	if (value && typeof value === "object" && typeof value.then === "function") {
		const { then } = value;
		return new myPromise((resolve) => {
			then(resolve);
		});
	}
	if (value) {
		return new myPromise((resolve) => resolve(value));
	}
	return new myPromise((resolve) => resolve());
};

// 类似 myPromise(undefined,reject)
myPromise.prototype.reject = function (value) {
	return new myPromise((resolve, reject) => {
		reject(value);
	});
};

// all与race参数一致
myPromise.prototype.all = function (arr) {
	const args = Array.prototype.slice.call(arr);
	return new myPromise((resolve, reject) => {
		if (args.length === 0) return resolve([]);
		let remaining = args.length;

		function res(i, val) {
			try {
				if (val && (typeof val === "object" || typeof val === "function")) {
					const { then } = val;
					if (typeof then === "function") {
						then.call(
							val,
							(val) => {
								res(i, val);
							},
							reject
						);
						return;
					}
				}
				args[i] = val;
				if (--remaining === 0) {
					resolve(args);
				}
			} catch (ex) {
				reject(ex);
			}
		}
		for (let i = 0; i < args.length; i++) {
			res(i, args[i]);
		}
	});
};

// race传参数的是一个数组 其中哪一个先返回来  就结束
myPromise.prototype.race = function (values) {
	return new myPromise((resolve, reject) => {
		for (let i = 0, len = values.length; i < len; i++) {
			values[i].then(resolve, reject);
		}
	});
};

/**
 * promise
 */

let testMyPromise = new myPromise(
	() => {},
	() => {}
);

console.log(testMyPromise);

let normalPromise = new Promise(
	() => {},
	() => {}
);

console.log(normalPromise);

/**
 * 数组乱序(洗牌算法)
 *
 *每个数的值 抽取一个随机的index赋值
 *
 * 0 <= Math.random < 1
 */

function suffle(arr) {
	for (let i = 0; i < arr.length; i++) {
		// 向下取整 j的值可能是 0 <=j <(i+1)之间的某一个数
		var j = Math.floor(Math.random() * (i + 1));

		// 解构赋值 ==== 实际测试的时候不行  j进入了暂时性死区 why??
		// [arr[i],arr[j]] = [arr[j],arr[i]]

		// console.log(i,j)
		// 普通赋值
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	return arr;
}
// console.log(suffle([1,2,3,4,5,6,7]))
// console.log(suffle([1,2,3,4,5,6,7]))
// console.log(suffle([1,2,3,4,5,6,7]))

/**
 *
 * 寄生组合模式
 */

function Parent(name) {
	this.name = name;
}

Parent.prototype.eat = function () {
	console.log("parent eat rice");
};

function Child(name, age) {
	Parent.call(this, name);
	this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.test = function () {
	console.log("test");
};

// let child1 = new Child('niuniu',4)

// console.log(child1)

/**
 * 三数之和
 * 1.可以用两数之和的方法 循环两遍 此时时间复杂度O(n2) 空间复杂度 O(n)
 * 2.用双指针的办法 需要先对数组进行从小到大排序 也是循环两遍 时间复杂度O(n2) 空间复杂度O(1) 因为是在原数组上修改的
 *
 * 返回所有可能的结果
 *
 * 如果要获取原来的数组的下标怎么办？？ 用第一种方法 hash表种存下标
 */

function threeSum(arr, sum) {
	if (!Array.isArray(arr) || !arr.length) return [];
	let newArr = [];

	arr = arr.sort((a, b) => {
		return a - b;
	});

	console.log(arr);

	for (let i = 0; i < arr.length; i++) {
		let target = sum - arr[i];

		let start = i + 1;
		let end = arr.length - 1;

		while (start < end) {
			let tempSum = arr[start] + arr[end];

			if (i == 0) {
				console.log(tempSum, start, end);
			}
			if (tempSum == target) {
				newArr.push([arr[i], arr[start], arr[end]]);
				end--;
			} else if (tempSum < target) {
				start++;
			} else {
				end--;
			}
		}
	}

	return newArr;
}

// let oArr = [1,2,3,4,5,6,7,8,9,10,11,12]
// console.log(threeSum(oArr,13))

/**
 *两数之和
 *获取所有可能的结果
 *
 * obj中的结构： {
 *   'target - item1':对应item的index,
 *   'target - item3':对应item3的index
 * }
 *
 * 第i个元素item2,如果obj[item2]存在 说明 item2 = target -item1 即 item1+item2 = target
 * 此时： item1 = arr[ obj[target - item1] ]    item2 = arr[i]
 */

function twoSum(arr, target) {
	let obj = {};
	let newArr = [];

	for (let i = 0; i < arr.length; i++) {
		if (obj[arr[i]] || obj[arr[i]] === 0) {
			newArr.push([arr[i], arr[obj[arr[i]]]]);
		} else {
			obj[target - arr[i]] = i;
		}
	}

	return newArr;
}
// let oArr = [1,2,3,4,5,6,7,8,9,10,11,12]
// console.log(twoSum(oArr,13))

/**
 * 翻转二叉树
 */
function tranverse(root) {
	if (root === null) return root;
	let temp = root.right;
	root.left = root.right;
	root.right = root.left;

	tranverse(root.left);
	tranverse(root.right);
	return root;
}

/**
 * 冒泡排序
 * 时间复杂度 O(n2) 空间复杂度 O(1)
 * 稳定性： 稳定
 */
function bubbleSort(arr) {
	for (let i = 0; i < arr.length; i++) {
		for (let j = i; j < arr.length; j++) {
			if (arr[i] > arr[j]) {
				let temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
			}
		}
	}

	return arr;
}
// console.log(bubbleSort([2,5,12,6,8,4,1,35,2]))

/**
 * 插入排序
 * 将整个数组a分为有序和无序的两个部分。前者在左边，后者在右边。开始有序的部分只有a[0] , 其余都属于无序的部分
 * 每次取出无序部分的第一个（最左边）元素，把它加入有序部分。
 * 假设插入合适的位置p，则原p位置及其后面的有序部分元素都向右移动一个位置，有序的部分即增加了一个元素。一直做下去，直到无序的部分没有元素
 *
 * 时间复杂度 O(n2) 空间复杂度 O(1)
 * 稳定性： 稳定
 * Array.prototype.splice(index,howmany,item1,item2) howmany可以是0
 */
function insertSort(arr) {
	let handle = [];
	handle.push(arr[0]);

	for (let i = 1; i < arr.length; i++) {
		// 与handle中的值比较 从后向前
		for (let j = handle.length - 1; j >= 0; j--) {
			// 把arr[i]插入handle[j]的后面
			if (arr[i] > handle[j]) {
				handle.splice(j + 1, 0, arr[i]);
				break;
			}
			// arr[i]比handle中的所有数都小
			if (j === 0) {
				handle.unshift(arr[i]);
			}
		}
	}

	return handle;
}
// console.log(insertSort([2,5,12,6,8,4,1,35,2]))

/**
 * 希尔排序 是插入排序的改进版 希尔排序会优先比较距离较远的元素
 * 第一个突破o(n2)的算法
 * 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率
 * 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位
 *
 * 希尔排序的核⼼在于间隔序列的设定
 * 时间复杂度 o（nlog2n） 空间复杂度 o(1)
 * 稳定性： 不稳定
 *
 * [3,2,0,4,1,6]
 * 第一次 step =  4 因此比较是 3与4比较 2与1比较 0与6比较
 */

function shellSort(arr) {
	var gap = Math.floor(arr.length / 2);
	var temp;

	while (gap >= 1) {
		for (let i = gap; i < arr.length; i++) {
			temp = arr[i];
			for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
				arr[j + gap] = arr[j];
			}
			arr[j + gap] = temp;
		}
		gap = Math.floor(gap / 2);
	}

	return arr;
}
// console.log(shellSort([2,5,12,7,15,6,8,4,1,35,2]))

/**
 * 归并排序
 * 归并排序采用的是分治的思想，首先是“分”，
 * 将一个数组反复二分为两个小数组，
 * 直到每个数组只有一个元素；
 * 其次是“治”，从最小数组开始，
 * 两两按大小顺序合并，直到并为原始数组大小
 * 类似于二叉树的 后序遍历
 * 时间复杂度 o（nlog2n） 空间复杂度 o(n)
 *
 */
function mergeSort(arr) {
	const length = arr.length;
	if (length === 1) {
		return arr;
	}

	// const mid = left + (right -left)/2
	const mid = Math.floor(arr.length / 2);
	const left = arr.slice(0, mid);
	const right = arr.slice(mid);

	mergeArr(mergeArr(left), mergeArr(right));
}

/**
 * 快速排序
 * 选定一个基数  大于基数的放右边 小于基数的放左边
 * 结束条件是数组的长度小于等于1时
 */

function quickSort(arr) {
	const len = arr.length;
	if (len <= 1) {
		return arr;
	}

	let index = Math.floor(len / 2);
	let left = [];
	let right = [];

	let pivotItem = arr.splice(index, 1)[0];
	arr.forEach((item) => {
		if (item >= pivotItem) {
			right.push(item);
		} else if (item < pivotItem) {
			left.push(item);
		}
	});

	return quickSort(left).concat(pivotItem, quickSort(right));
}

// console.log(quickSort([3,2,1,5,6,2,4,9,7]))

/**
 * 二分查找
 * 二分查找的问题在于到底给mid加1还是减1 while里到底用<= 还是用<
 * 搜索一个元素时 搜索区间两端闭 while条件带等号 否则需要打补丁 if相等就返回 mid必须加减1 因为区间两端闭？
 */
function binarysSearch(nums, target) {
	let left = 0;
	let right = nums.length - 1;

	while (left <= right) {
		let mid = left + (right - left); // 即 mid = (left + right)/2 这样写可以防止left与right太大直接相加导致溢出
		if (nums[mid] == target) {
			return mid;
		} else if (nums[mid] < target) {
			left = mid + 1;
		} else if (nums[mid] > target) {
			right = mid - 1;
		}

		// 或者return nums[left] nums[right]
	}

	return -1;
}

/**
 * 不使用temp交换arr[i] 与arr[j]
 */
function swap(arr, i, j) {
	arr[i] = arr[i] + arr[j];
	arr[j] = arr[i] - arr[j];
	arr[i] = arr[i] - arr[j];
	return arr;
}

var lengthOfLongestSubstring = function (s) {
	let maxLen = 0;
	let tempArr = [];
	for (let i = 0; i < s.length; i++) {
		let idx = tempArr.indexOf(s[i]);
		if (idx === -1) {
			tempArr.push(s[i]);
		} else {
			maxLen = Math.max(maxLen, tempArr.length);
			tempArr.push(s[i]);
			tempArr = tempArr.slice(idx + 1);
		}
	}
	maxLen = Math.max(maxLen, tempArr.length);
	return maxLen;
};
// lengthOfLongestSubstring("dvdf")

// var nextGreaterElement = function(nums1, nums2) {
//     let allRes = new Map()
//     let stack = []

//     for(let i = 0;i<nums2.length;i++){
//         while(stack.length && nums2[i] > stack[stack.length-1]){
//             allRes.set(stack.pop(),nums2[i])
//         }
//         stack.push(nums2[i])
//     }

//     let res = []
//     for(let j = 0;j<nums1.length;j++){
//         res[j] = allRes.get(nums1[j])
//     }

//     return res
// }

/**
 * 下一个更大的元素 单调栈
 */

var nextGreaterElement = function (nums1, nums2) {
	let allRes = new Map();
	let stack = [];

	for (let i = nums2.length - 1; i >= 0; i--) {
		while (stack.length && nums2[i] >= stack[stack.length - 1]) {
			stack.pop();
		}
		allRes.set(nums2[i], stack.length ? stack[stack.length - 1] : -1);
		stack.push(nums2[i]);
	}

	let res = [];
	for (let j = 0; j < nums1.length; j++) {
		res[j] = allRes.get(nums1[j]);
	}

	return res;
};
// nextGreaterElement([2,4],[1,2,3,4])
nextGreaterElement([4, 1, 2], [1, 3, 4, 2]);


/**
 *公平的洗牌算法
 */

function shuffle() {
	
}