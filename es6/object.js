/**
 * 对象 类 函数
 *
 * 将函数作为构造器并在函数中向它的实例(也就是this对象)抄写类声明的属性 则称呼这个函数为类 被创建出来的实例是对象 类说明了实例的结构
 * 类的开头一般为大写
 *
 * //这个本质是类抄写 在一个函数中不停地向this对象写属性 这是类继承。
 * //类式继承(也叫构造函数继承)是在函数对象内调用父类的构造函数，使得自身获得父类的方法和属性。call和apply方法为类式继承提供了支持。
 * //通过改变this的作用环境，使得子类本身具有父类的各种属性
 * 
 * 比如 function Car() {
 *   this.name = 'car'
 *   this.color = 'red'
 * }
 *
 *
 * // 
 * var x = new Car()
 *
 * // 原型继承 基于原型链检查  instanceof检查一个对象是不是某个类的实列或者子类实列 (动态地访问原型链)  x instanceof Aclass 是运用 Aclass.prototype来对比
 * prototype是显示继承 _pro
 *
 * // 如果一个函数被运用为x = new Car()或者从x.constructor这样的属性中读取时 则这个函数看作时构造器 当它用作 x instanceof Car 这样的运算 或者讨论OOP的继承关系时 它被理解为类
 *
 *
 * es6之后 使用了class来声明类的语法 类只能用new运算符来创建 不能使用()来做函数的调用
 *         并且不能对方法做new运算
 *
 * 类： 只可以做new 运算  类也是作为方法来创建的 但是它有独立的构造过程和原型属性
 * 方法：只可以做（）运算 方法声明时 具有一个[[homeObject]]内部槽 没有名为构造器[[Construct]]的内部槽 没有名为prototype的属性
 * 一般函数： 同时可以做new和调用运算
 *
 * 函数的prototype属性描述符不能删除 但是可以修改 当这个值被修改为null时 他的子对象是以null值为原型 当它被修改成非对象值时，它的子对象时以Object.prototype为原型的。
 * 当它是一个对象类型的值时，它的子类才会使用该对象作为作为原型来创建实列。
 *
 * new的实际作用： 构造器函数f 使用new运算 那么new预算会使用f.prototype作为原型来创建一个this对象，然后才是调用f()函数,并将这个函数的执行过程理解为类抄写(向用户实列抄写类所声明的属性)
 *
 *
 * call/apply/bind
 *
 * car.call(null,str1,str3)  car.apply(null,[str1,str2])   bind不会立即执行函数 bind返回的是一个改变了上下文的函数
 *
 * 应用1： 把类数组(只有length属性，没有数组对应的push，forEach这些方法)转化成数组 Array.prototype.slice.call(类数组) 其实再ES6中可以直接   类数组 = [...类数组] 用展开父
 *         含有length属性的对象也可以用Array.prototype.slice.call获取到对应的值 为什么？比如 {0:'test',1:'test11',length: 2}
 *
 * 应用2： 判断变量的类型 Object.prototype.toString.call(arr1)
 *
 *
 * object.create是用来干嘛的  es5中用来规范化原型式继承的，接收两个参数 object.creat(新对象的原型的对象，为新对象定义额外属性的对象(可不传)) 只是浅克隆
 * 第二个参数的格式和与Object.defineProperties()的第二个参数格式相同
 */

const test = {
  name:'test',
  friends: ['1','2','3']
}

const test2 = Object.create(test,{
  name:  {
    configurable: false,
    value: '不能修改'
  }
})

console.log(test2)
test2.friends.push('4')
console.log(test2.friends)
console.log(test.friends)
