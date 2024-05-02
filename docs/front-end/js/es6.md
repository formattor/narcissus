# Reflect

一系列的对对象操作的静态方法

我理解的就是在**运行时**对**对象本身**的操作称之为反射

1. 更多操控自身的api

2. 在defineProerty时返回boolean而不是抛出异常

3. 不需要关键字调用，使代码更加具有可读性

Reflect和proxy的参数是对应的，可以在proxy中使用Reflect

``` js
new Proxy(obj, {
  set(...args) {
    return Reflect.set(...args)
  },
  get(...args) {
    return Reflect.get(...args);
  },
  deleteProperty(...args) {
    return Reflect.deleteProperty(...args);
  },
  has(...args) {
    return Reflect.has(...args);
  }
}
```