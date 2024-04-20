一个类仅有一个实例

# 单例

::: tip workflow

1. 构建一个Singleton类

2. 添加instance属性和createSingleton方法

3. 在调用createSingleton方法时，通过判断instance是否为空决定是否new新的实例对象

4. instance不为空则直接返回之前的实例，不会再new一次了

:::

+ 想要创建单例必须知道funciton构造函数上的方法名称，不能使用new直接构建

![single1.png](https://img2.imgtp.com/2024/04/20/6ZyNV1ac.png)

``` js
// 保证一个类仅有一个实例，并提供一个访问它的全局访问点
var Singleton = function (name) {
    this.name = name;
}

// Singleton.prototype.getName = function () {
//     return this.name;
// }

Singleton.instance = null;
Singleton.createSingleton = function (name) {
    if (!this.instance) {
        this.instance = new Singleton(name)
    }
    return this.instance;
}

// var s1 = new Singleton('张三1');
// var s2 = new Singleton('张三2');
var s1 = Singleton.createSingleton('张三1')
var s2 = Singleton.createSingleton('张三2')

console.log(s1 === s2);
console.log(s1);

// console.log(s1, s1.name);
// console.log(s2, s2.name);
// console.log(s1.getName());
// console.log(s2.getName());
// console.log(s2 === s1);
```

# 闭包单例

通过闭包+自执行的方式保存instance变量

+ 闭包会占用内存空间

![singleCloure2.png](https://img2.imgtp.com/2024/04/20/Qpzuj1FY.png)

``` js
var closureSingleton = function (name) {
    this.name = name;
}

// 自执行函数运行时直接调用一次，在之后的调用时只执行return时候的方法
closureSingleton.createSingleton = (function () {
    var instance = null;
    return function (name) {
        if (!instance) {
            instance = new closureSingleton(name)
        }
        return instance;
    }
})()

var s1 = closureSingleton.createSingleton('张三')
var s3 = closureSingleton.createSingleton('张三3')
console.log(s1 === s3);

// 不透明，要使用构造函数的方法进行实例化，而非new
```

# 透明单例

// todo

通过闭包+自执行的方式直接返回创建方法和保存instance变量，这种方式可以直接new新的实例

``` js
var createDiv = (function () {
    var instance = null;
    var createDDD = function (html) {
        if (instance) {
            return instance
        }
        this.html = html;
        this.init();
        return instance = this;
    }

    createDDD.prototype.init = function () {
        var div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild(div);
    }

    return createDDD;
})()

var s1 = new createDiv('sss1')
var s2 = new createDiv('sss2')

console.log(s1 === s2, s1, s2);
```

# 代理单例

调用代理类，将创建类与单例分开，符合单一职责原则

+ 依然会因为自执行函数而造成资源浪费

![singleProxy4.png](https://img2.imgtp.com/2024/04/21/WFsR9HTG.png)

``` js
var CreateDDD = function (html) {
    this.html = html;
    this.init();
}

CreateDDD.prototype.init = function () {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
}

// let s1 = CreateDDD('sss')
// console.log(s1);

var proxyCreateDDD = (function () {
    var instance = null;
    return function (html) {
        if (!instance) {
            instance = new CreateDDD(html)
        }
        return instance;
    }
})()

let s1 = new proxyCreateDDD('zzz1')
let s2 = new proxyCreateDDD('zzz2')
console.log(s1, s2, s1 === s2);
// 通过代理模式，将初始化类与单例分开，符合单一职责原则
```

# 惰性单例

// todo

在需要的时候才创建单例模式

``` js
var CreateLoginLayer = (function () {
    var div;
    return function () {
        if (!div) {
            div = document.createElement('div')
            div.innerHTML = '登录浮窗'
            div.style.display = 'none'
            document.body.appendChild(div)
        }
        return div
    }
})()

document.getElementById('login').onclick = function () {
    var loginLayer = CreateLoginLayer();
    loginLayer.style.display = 'block';
};
```

# 通用惰性单例

+ 单一职责

+ 在不调用的时候不会产生闭包

+ 透明

+ 代理

``` js
var getSingle = function (initFn) {
    var instance;
    return function () {
        return instance || (instance = initFn.apply(this, arguments))
    }
}

var createLoginLayer = function () {
    var div = document.createElement('div');
    div.innerHTML = '登录页面'
    div.style.display = 'none';
    document.body.appendChild(div)
    return div
}

var loginInstance = getSingle(createLoginLayer);
document.getElementById('login').onclick = function () {
    var login = loginInstance();
    login.style.display = 'block'
}
```

# 源码

> https://github.com/formattor/designPattern