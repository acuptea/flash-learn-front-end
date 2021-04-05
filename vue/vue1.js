/**
 *
 * 发布者=>订阅者
 * 一个事件 可以有很多个订阅者
 * 1、new vue首先执行初始化 把data中的数据做成响应式数据(通过observe实现)
 * 2、对模板进行编译，找到其中动态绑定的数据，从data中获取初始数据，并赋值给模板
 * 3、同时定义一个更新函数和watcher,将来对应数据变化时，watcher会调用通知函数(通知视图更新)
 * 4、由于data的某个key在一个视图中可能出现多次,所以每个key需要一个管家Dep来管理多个watcher
 * 5、将来data中数据一旦发生变化，会首先找到对于的Dep，通知所有的watcher执行更新函数
 */
// 劫持所有属性 
function observe(obj) {
  if(typeof obj !== 'object' ||  obj === null) return
  // 每次遍历一个对象属性就创建一个Ob实例 创建这个ob实列有什么用？
  new Observer(obj)   
}
function defineReactive(obj,key,val) {
  // 递归遍历，如果val本身是个对象
  observe(val)
  // 创建Dep实例和key 一一对应
  const dep = new Dep()
  Object.defineProperty(obj,key,{
    get() {
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {
      if(newVal === val) return
      val = newVal
      // 如果val本身是对象，则还是需要做响应式处理
      observe(newVal)
      dep.notify()
    }
  })
}
// 做代理之后 可以直接通过this.tableData这种方式来访问
function proxy(vm) {
  Object.keys(vm.$data).forEach(key=>{
    Object.defineProperty(vm,key,{
      get() {
        return vm.$data[key]
      },
      set(newVal) {
        vm.$data[key] = newVal
      }
    })
  })
}

class Vue {
  constructor(options) {
    // 先把数据存起来
    this.$options = options
    this.$data = options.data
    //data中的数据变成响应式的
    observe(this.$data)
    //数据响应
    proxy(this)
    new Compile(this.$options.el,this)
  }
}
// 数据响应 分辨响应式数据对象是对象还是数组
class Observer {
  constructor(value) {
    this.value = value
    // if(Array.isArray(value)) {
    //   this.walkArray(value)
    // } else {
      
    // }
    this.walk(value)
  }
  walk(obj) {
    Object.keys(obj).forEach(key=>{
      defineReactive(obj,key,obj[key])
    })
  }
  walkArray(oArr) {
    // 覆盖原型 替换变更操作
    // const originalProto = Array.prototype
    // const arrayProto = Object.creat(originalProto)
    // ['push','pop','unshift','shift'].forEach(methed=>{
    //   arrayProto[methed] = function() {
    //     // 原始操作
    //     originalProto[methed].apply(this,arguments)
    //     // 覆盖操作 通知更新
        
    //   }
    // })
    // obj.__proto__ = arrayProto
    // Objec.keys(obj).forEach(idx=>{
    //   observe(obj[item])
    // })
  }
}

// 编译模板: 解析指令、初始化试图、订阅数据变化绑定更新函数、初始化视图 收集依赖(更新函数、watcher创建)
class Compile {
  constructor(el,vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    if(this.$el) {
      this.compile(this.$el)
    }
  }

  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node=>{
      if(this.isElement(node)) {
        // 是html标签
        this.compileElement(node)
      } else if (this.isInterpolation(node)) {
        // console.log("编译插值文本：" + node.textContent)
        this.compileText(node)
      }
      if(node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  // 1元素 2属性(attr) 3 text
  isElement(node) {
    return node.nodeType === 1
  }
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileText(node) {
    // console.log(RegExp.$1)
    // node.textContent = this.$vm[RegExp.$1]
    this.update(node,RegExp.$1,'text')
  }
  compileElement(node) {
    let nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr=>{
      let name = attr.name
      let exp = attr.value
      if(this.isDirective(name)) {
        // dir是匹配出来的命令 比如v-text v-html
        let dir = name.substring(2)
        this[dir] && this[dir](node,exp)
      }
      if(this.isEvent(name)) {
        let dir = name.substring(1)
        this.eventHandler(node,exp,dir)
      }
    })
  }
  isDirective(name) {
    return name.indexOf('v-') === 0
  }
  isEvent(name) {
    return name.indexOf('@') === 0
  }
  eventHandler(node,exp,dir) {
    let fn = this.$vm.$options.methods && this.$vm.$options.methods[exp]
    node.addEventListener(dir,fn.bind(this.$vm))
  }
  // v-text="testData" exp就是testData
  text(node,exp) {
    // node.textContent = this.$vm[exp]
    this.update(node,exp,'text')
  }
  html(node,exp) {
    // node.innerHTML = this.$vm.exp
    this.update(node,exp,'html')
  }
  // 双向绑定 v-model = "value"
  model(node,exp) {
    this.update(node,exp,'model')
    // 事件监听 根据不同的表单元素使用不同的事件 假设是input
    node.addEventListener('input',e=>{
      // 这里必须用this.$vm[exp] 如果用this.$vm.exp就不行 why ??
      this.$vm[exp] = e.target.value
    })
  }
  // 增加统一的update是为了统一添加watcher
  update(node,exp,dir) {
    // 检查是否存在实操函数
    const fn = this[dir+'Updater']
    // 初始化
    fn && fn(node,this.$vm[exp])
    // 更新
    new Watcher(this.$vm,exp,function(val) {
      fn && fn(node,val)
    })
  }
  textUpdater(node, val) {
    node.textContent = val;
  }
  htmlUpdater(node, val) {
    node.innerHTML = val
  }
  modelUpdater(node,val) {
    // 表单元素赋值
    node.value = val
  }
}
/**
 * 依赖收集 更新视图 添加订阅者 订阅者收到变化消息
 * 比如 <p>{{name1}}</p><p>{{name2}}</p><h1>{{name1}}</h1>
 * 这个时候 有三个watcher1 watcher2 watcher3 对应三处订阅者 
 * 有两个事件发布者或者管家(Dep) Dep1(通知watcher1\watcher3) Dep2(通知watcher2)
 * 和模板中的依赖1对1对应，如果某个key发生变化 则执行更新函数
 * 在vue2中 是一个组件对应一个管家 如果一个key拥有一个管家 会太卡了
 *
 * 如何实现：在defineReactive的时候 为每一个key创建一个Dep实例
 * 初始化视图时 会读取key 比如name1,就创建一个watcher1
 * 由于触发name1的getter方法 便将watcher1添加到name1对应的Dep中
 * 当name1更新 setter触发时 便通过对应的Dep通知其管理的所有watcher更新
 */
class Watcher {
  constructor(vm,key,updater) {
    this.vm = vm
    this.key = key
    this.updater = updater

    // 与dep建立关系 触发getter 在getter的过程中 把this也就是watcher放到对应key的dep中
    Dep.target = this
    this.vm[this.key] 
    Dep.target = null
  }
  update() {
    this.updater.call(this.vm,this.vm[this.key])
  }
}
// 管理通知watcher
class Dep {
  constructor() {
    this.watchers = []
  }
  addDep(watcher) {
    this.watchers.push(watcher)
  }
  notify() {
    this.watchers.forEach(watcher=>{
      watcher.update()
    })
  }
}

