// observe compile watcher 关联器 入口

//  递归函数
function observe(data) {
    //	递归所有子属性
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(function (key) {
      defineReactive(data, key, data[key]);
    })
  }
  //  数据监听器
  function defineReactive(data, key, val) {
    observe(val); // 调用递归函数
    var dep = new Dep(); // 创建订阅器
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () { // 查看键值的时候调用
        if (Dep.target) { // 如果观察者存在，则添加到订阅器里面
          dep.addSub(Dep.target)
        }
        return val;
      },
      set: function (newVal) { // 修改键值的时候调用
        if (val === newVal) {
          return
        }
        val = newVal;
        console.log('属性' + key + '已经被监听了，现在值为：' + newVal.toString() + ';')
        dep.notify() // 如果数据变化，通知所有已经添加的订阅者
      }
    })
  }
  // 订阅器
  function Dep() {
    this.subs = [] // 订阅者容器
  }
  Dep.target = null
  Dep.prototype = {
    addSub: function (sub) {
      this.subs.push(sub) // 添加订阅者
    },
    notify: function () {
      this.subs.forEach(function (sub) {
        sub.update() // 通知所有的订阅者
      })
    }
  }
  // 订阅者
  function Watcher(vm, exp, callback) {  // vm实际dom exp key名 cb更新函数
    this.callback = callback;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get(); // 调用函数把自己存到订阅器中
  }
  Watcher.prototype = {
    update: function () {
      this.run()
    },
    run: function () {
      var value = this.vm.data[this.exp];
      var oldVal = this.value;
      if (value !== oldVal) {
        this.value = value;
        this.callback.call(this.vm, value); // 替换
      }
    },
    get: function () {
      Dep.target = this; //缓存自己
      var value = this.vm.data[this.exp]; // 调用监听器里面的get函数  将自己添加到订阅器里面
      Dep.target = null; // 释放自己
      return value;
    }
  }
  // 解析器
  function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el); // 获取dome元素
    this.fragment = null;
    this.init();
  }
  Compile.prototype = {
    init: function () {
      if (this.el) {
        this.fragment = this.nodeToFragment(this.el); // 将该节点放置在创建的文档碎片中介中
        this.compileElement(this.fragment);
        this.el.appendChild(this.fragment);
      } else {
        console.log('Dom元素不存在');
      }
    },
    nodeToFragment: function (el) {
      var fragment = document.createDocumentFragment(); // 创建文档碎片
      var child = el.firstChild;
      while (child) {
        // 将Dom元素移入fragment中
        // a.appendChild(b) 将b的元素移除，然后添加到a中（这样懂了吧）
        fragment.appendChild(child);
        child = el.firstChild
      }
      return fragment; // 返回文档碎片
    },
    compileElement: function (el) {
      var childNodes = el.childNodes;
      var self = this;
      [].slice.call(childNodes).forEach(function (node) {
        var reg = /\{\{(.*)\}\}/;
        var text = node.textContent;
        if (self.isElementNode(node)) {
          self.compile(node);
        } else if (self.isTextNode(node) && reg.test(text)) { // 判断是否是符合这种形式{{}}的指令
          self.compileText(node, reg.exec(text)[1]);
        }
  
        if (node.childNodes && node.childNodes.length) {
          self.compileElement(node);// 继续递归遍历子节点
        }
      });
    },
    compile: function (node) {
      var nodeAttrs = node.attributes;
      var self = this;
      Array.prototype.forEach.call(nodeAttrs, function (attr) {
        var attrName = attr.name;
        if (self.isDirective(attrName)) {
          var exp = attr.value;
          var dir = attrName.substring(2);
          if (self.isEventDirective(dir)) {  // 事件指令
            self.compileEvent(node, self.vm, exp, dir);
          } else {  // v-model 指令
            self.compileModel(node, self.vm, exp, dir);
          }
          node.removeAttribute(attrName);
        }
      });
    },
    compileText: function (node, exp) {
      var self = this;
      var initText = this.vm[exp];
      this.updateText(node, initText);  // 将初始化的数据初始化到视图中
      new Watcher(this.vm, exp, function (value) { // 生成订阅器并绑定更新函数
        self.updateText(node, value);
      });
    },
    compileEvent: function (node, vm, exp, dir) {
      var eventType = dir.split(':')[1];
      var callback = vm.methods && vm.methods[exp];
  
      if (eventType && callback) {
        node.addEventListener(eventType, callback.bind(vm), false);
      }
    },
    compileModel: function (node, vm, exp, dir) {
      var self = this;
      var val = this.vm[exp];
      this.modelUpdater(node, val);
      new Watcher(this.vm, exp, function (value) {
        self.modelUpdater(node, value);
      });
  
      node.addEventListener('input', function (e) {
        var newValue = e.target.value;
        if (val === newValue) {
          return;
        }
        self.vm[exp] = newValue;
        val = newValue;
      });
    },
    updateText: function (node, value) {
      node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value) {
      node.value = typeof value == 'undefined' ? '' : value;
    },
    isDirective: function (attr) {
      return attr.indexOf('v-') == 0;
    },
    isEventDirective: function (dir) {
      return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
      return node.nodeType == 1;
    },
    isTextNode: function (node) {
      return node.nodeType == 3;
    }
  }
  // 关联模块
  function SelfVue(options) {
    var self = this;
    this.data = options.data;
    this.methods = options.methods;
    Object.keys(this.data).forEach(function (key) {
      self.proxyKeys(key);  // 绑定代理属性
    })
    observe(this.data);
    new Compile(options.el, this);
    options.mounted.call(this);
  }
  SelfVue.prototype = {
    proxyKeys: function (key) {
      var self = this;
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        get: function () {
          return self.data[key];
        },
        set: function (newVal) {
          self.data[key] = newVal;
        }
      });
    }
  }

  export default SelfVue;