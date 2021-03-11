/**
 * 类型判断
 *
 * js类型： string/number/boolean/object/null/undefined/symbol
 * 原始类型/值类型： string/number/boolean/null/undefined/symbol
 * 对象类型（引用类型）：object 
 *
 * 区别是对象类型的值存在堆内存中，栈内存中存的是指针，指向堆内存中的值，原始类型
 *
 *
 * 类型识别
 *
 * 1.typeof string/number/boolean/undefined  null/object/array ==> object  function ===> function 可以识别基础类型(null除外) 不能识别具体对象类型(function除外)
 * 2.instanceof 可以判别内置对象类型 不能判断原始类型 可以判别自定义对象类型
 * 3.Object.prototype.toString.call 可以识别标准类型以及内置对象类型 不能识别自定义对象类型
 * 4.constructor 可以判断标准类型(undefined/null除外) 可以识别内置对象类型 可以识别自定义对象类型  用法 ({}).constructor === Object (1).constructor === Number
 * 获取构造函数名称的方法 见下面的代码
 * 
 * 隐式类型转换
 * 隐式类型转化是由于js是动态语言产生的 以下场景会产生类型转化
 * 1.数值预算符号 number + string 所有的数值运算符 ，除了 + 其余的都是把string转为number why???
 * 2.运用.号调用方法  ？？？
 * 3.if语句
 * 4. == 
 *
 * 隐式类型的转化的原理
 */

/**
 * 考察隐式类型
 */

console.log([]+{}) // [object Object]
console.log({}+[]) // [object Object]
console.log(+[]) // 0
console.log(-{}) // NaN

/**
 * 先有的{n:2} 再修改a指针的指向
 */
var a = {n:1};
a.x = a = {n:2}
console.log(a.x)

/**
 * 深度克隆
 */
// 获取数据类型
function getClass(obj) {
  return Object.prototype.toString().call(o).slice(8,-1)
}

/**
 * 获取构造函数名称方法
 */
function getConstructorName(obj) {
  return (obj === undefined || obj === null) ? obj : (obj.constructor && obj.constructor.toString().match(/function\s*([^(]*)/)[1])
}