/**
 * vue2实现双向绑定是利用了Object.defineProperty
 * 此处实现vue1.0版本
 */

// 定义响应式数据
function defineReactive(obj,key,val) {
  // 这里的observe是为了解决对象嵌套问题 比如obj.a.z 中的z属性 也是响应式的
  observe(val)
  Object.defineProperty(obj,key,{
    get() {
      // console.log(`get:${key},val:${val}`)
      return val
    },
    set(newVal) {
      if(newVal !== val) {
        console.log(`set:${key},val:${newVal}`)
        val = newVal
        // 解决赋值是对象 比如 obj.c = {d:'4444'} 把属性d也加入响应式
        observe(val)
        // update(val)
      }
    }
  })
}
// 更新
function update(newVal) {
  let el = document.getElementById('app')
  console.log(document.getElementById)
  el.innerText = newVal
}
// 劫持一个对象的所有属性
function observe(obj) {
  if(typeof obj !== 'object' || obj === null) return
  Object.keys(obj).forEach(key=> {
    defineReactive(obj,key,obj[key])
  })
}
// 添加、删除新属性无法检测
function set(obj,key,val) {
  defineReactive(obj,key,val)
}
const obj = {
  a:'a',
  b:'b',
  c: {
    z:'zz'
  }
}
observe(obj)
obj.a
obj.a = '1111'
obj.b
obj.b = '2222'
obj.c.z
obj.c.z = '3333'
obj.c = {
  d:'44444'
}
obj.c.d = '5555555'
set(obj,'e','666666')
obj.e = '7777777'
