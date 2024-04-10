single-spa解决了路由监听和获取资源的问题

# 使用
``` js
// 注册微应用
registerApplication(apps)
// 开启微应用
start()
```

``` js
// 提供生命周期钩子
bootstrap(app)
mount(app)
unmount(app)
```

挂载资源需要用户自己去处理，比如后来封装的systemjs,支持多个script加载
