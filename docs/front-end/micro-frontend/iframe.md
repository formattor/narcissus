## 用法

``` html
<iframe 
    id="iframe"
    src="https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe"
    frameborder="0" 
    width="100%" 
    height="100%">
</iframe>
```

## 介绍

::: tip 优点

1. JS隔离

2. CSS隔离

3. 配置方便

:::

::: danger 缺点

1. URL不同步。刷新浏览器子应用路由丢失，后退前进按钮子应用无法使用。

2. UI 不同步。Dialog无法在父容器内居中。

3. 全局上下文完全隔离，内存变量不共享。

4. 加载缓慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

:::

[Why not use iframe?](https://www.yuque.com/kuitos/gky7yw/gesexv)
