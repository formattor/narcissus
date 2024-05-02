# [call](https://github.com/mqyqingfeng/Blog/issues/11)

## call,apply,bind的区别

|api|decribe|
|--|--|
|call|参数不固定|
|apply|第二个参数为数组|
|bind|调用不立即执行，返回值为一个函数|

call用途为修改this指向

## 用法

``` js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1

```

## 模拟

是在对象是添加了新的方法执行

``` js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```

## 重写

1. 讲this绑定给foo.fn

2. 执行fn

3. 删除fn

``` js
// 第一版
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

## 传参

``` js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call(foo, 'kevin', 18);
// kevin
// 18
// 1
```

## 模拟传参

传入的参数是不确定的

...args使用ES6语法

``` js
Function.prototype.call2 = function(context,...args){
    context.fn = this;
    context.fn(); // [!code --]
    context.fn(...args); // [!code ++]
    delete context.fn;
}

function bar(...args){
    console.log(args,this.a);
}

let foo = {
    a: 'foo',
}

bar.call2(foo,'1','2','3','4','5');
```

arguments拼接使用ES3之前语法

``` js
Function.prototype.call2 = function(context){
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}

function bar(a1,a2){
    console.log(a1,a2,this.a);
}

let foo = {
    a: 'foo',
}

bar.call2(foo,'1','2','3','4','5');
```

## 补充

### 指向为null

``` js
var value = 1;

function bar() {
    console.log(this.value);
}

bar.call(null); // 1
```
### call有返回值

``` js

var obj = {
    value: 1
}

function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```
### 修改版本

``` js
Function.prototype.call2 = function (context) {
    var context = context || window; // [!code ++]
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')'); // [!code ++]

    delete context.fn
    return result; // [!code ++]
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

# apply

``` js
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

# bind

``` js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo); 

bindFoo(); // 1
```

# debounce

// todo args and this

``` js
debounce(fn,delay){
    let timer;
    return function(){
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn();
        },delay)
    }
}
```

# throttle

// todo args and this

``` js
throttle(fn,delay){
    let timer;
    return function(){
        if(timer) return;
        timer = setTimeout(()=>{
            fn();
            timer = null;
        },delay)
    }
}
```