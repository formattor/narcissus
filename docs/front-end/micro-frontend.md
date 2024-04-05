# 前言
> Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently.     
[Micro-frontends.org](https://micro-frontends.org/)


web发展历史

<image src="/narcissus/micro1.png" alt="web history" />

微服务的思想诞生了微前端

<image src="/narcissus/micro2.png" alt="web history" />

## 微前端要解决的问题

::: tip 应用的加载与切换

监听路由

应用入口

应用加载
::: 

::: tip  应用的隔离与通信

JS隔离

CSS隔离

应用通信
::: 

# iframe

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

# single-spa

single-spa解决了路由监听和获取资源的问题

## 使用
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

# qiankun

## 路由监听获取资源
在single-spa的基础上进行了封装

## 资源加载
将single-spa的js entry替换为html entry

将子应用打包出来HTML作为入口，主框架通过fetch html的方式获取子应用静态资源，将HTML document作为子节点塞到主框架容器中，减少了主应用接入成本，子应用打包不需要调整，解决子应用之间的样式隔离问题。

## 样式隔离

通过主子应用之间的一些默认约定去规避冲突:不智能，旧项目不行

Shadow DOM： 根节点创建一个shadow root

scoped： 为子应用的根节点添加一个特定的随机属性,遍历style节点添加前缀

``` js
registerMicroApps({
    name:app1,
    sandbox:{
        // shadow dom
        strictstyleIsolation:true
        // scoped
        // experimentalStyleIsolation:true
    }
)
```


## JS隔离

::: details SnapshotSandbox

``` js
class Snapshotbox {
    windowSnapshot = {}
    modifyPropsMap = {}
    // 微应用运行状态
    active() {
        // 1.保存window对象上所有属性的状态
        for (const prop in window) {
            this.windowSnapshot[prop] = window[prop]
        }
        // 2.恢复上次运行该应用所修改过的window上的属性
        Object.keys(this.modifyPropsMap).forEach(prop => {
            window[prop] = this.modifyPropsMap[prop];
        })
    }
    // 微应用停止状态
    inactive() {
        for (const prop in window) {
            if (window[prop] !== this.windowSnapshot[prop]) {
                // 3.记录修改了window上的哪些属性
                this.modifyPropsMap[prop] = window[prop]
                // 4.还原window上微应用运行之前的状态
                window[prop] = this.windowSnapshot[prop]
            }
        }
    }
}

// window.city = 'beijing'

// 进入微应用

// window.city = 'shanghai'

// 退出微应用

// window.city = 'beijing'

window.city = 'beijing'

let snapSandbox = new Snapshotbox();

snapSandbox.active();

window.city = 'shanghai'

snapSandbox.inactive();

console.log(window.city); //beijing

snapSandbox.active();

console.log(window.city); // shanghai

// 遍历window所有属性，性能差
// 同一时间只能激活一个微应用
```

:::

::: details LegacySandbox

``` js
class LegacySandbox {
    currentUpdatePropsValueMap = new Map();
    modifiedPropsOriginalValueMap = new Map();
    addedPropsMap = new Map();
    proxyWindow = {}

    constructor() {
        const fakeWindow = Object.create(null);
        this.proxyWindow = new Proxy(fakeWindow, {
            set: (target, prop, value, receiver) => {
                const originalVal = window[prop];
                if (!window.hasOwnProperty(prop)) {
                    this.addedPropsMap.set(prop, value)
                } else if (!this.modifiedPropsOriginalValueMap.has(prop)) {
                    this.modifiedPropsOriginalValueMap.set(prop, originalVal)
                }
                this.currentUpdatePropsValueMap.set(prop, value);
                window[prop] = value;
            },
            get: (target, prop, receiver) => {
                return window[prop]
            }
        })
    }

    setWindowProp(prop, value, isToDelete) {
        if (value === undefined && isToDelete) {
            delete window[prop];
        } else {
            window[prop] = value;
        }
    }
    active() {
        // 回复上一次window运行状态
        this.currentUpdatePropsValueMap.forEach((value, prop) => {
            this.setWindowProp(prop, value);
        })
    }
    inactive() {
        // 还原window原有属性
        this.modifiedPropsOriginalValueMap.forEach((value, prop) => {
            this.setWindowProp(prop, value);
        })
        // 删除新增属性
        this.addedPropsMap.forEach((_, prop) => {
            this.setWindowProp(prop, undefined, true);
        })
    }
}


window.city = 'beijing'

let legacySandbox = new LegacySandbox();

legacySandbox.active();

legacySandbox.proxyWindow.city = 'shanghai'

legacySandbox.inactive();

console.log(window.city); //beijing

legacySandbox.active();

console.log(window.city); // shanghai

// 没有遍历对象的属性
// 也只能一个实例
``` 

:::

::: details ProxySandbox

``` js
class ProxySandbox {
    proxyWindow = {}
    isRunning = false;

    constructor() {
        const fakeWindow = Object.create(null);
        this.proxyWindow = new Proxy(fakeWindow, {
            set: (target, prop, value, receiver) => {
                if (this.isRunning) {
                    target[prop] = value;
                }
            },
            get: (target, prop, receiver) => {
                return prop in target ? target[prop] : window[prop];
            }
        })
    }

    active() {
        this.isRunning = true;
    }
    inactive() {
        this.isRunning = false;
    }
}

window.city = 'beijing'

let proxySandbox1 = new ProxySandbox();
let proxySandbox2 = new ProxySandbox();

proxySandbox1.active();
proxySandbox2.active();

proxySandbox1.proxyWindow.city = 'shanghai'
proxySandbox2.proxyWindow.city = 'nanjing'

proxySandbox1.inactive();

console.log(window.city); //beijing

proxySandbox1.active();

console.log(proxySandbox1.proxyWindow.city); // shanghai

console.log(proxySandbox2.proxyWindow.city); // nanjing

// 不需要遍历window
// 可以激活多个应用
```
:::
## 应用通信

父应用
``` js
import { initGlobalState } from 'qiankun'
const actions = initGlobalState(state);
// 主项目项目监听和修改
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev);
});
actions.setGlobalState(state);
```
子应用
``` js
export async function mount(props: any) {
    props.onGlobalStateChange((state, prev) => {
        // state: 变更后的状态; prev 变更前的状态
        console.log(state, prev);
        // 将这个state存储到我们子应用store
    });
    props.setGlobalState({ count: 2 });
    // render(props);
}
```

# wujie

## 应用通信

1. 子应用的js是存放在iframe中的，所以子应用就可以通过window.parent.variable的方式访问全局变量

2.  父组件 
    `:props={name:"zzz"}`
    子组件
     `window.$wujie.props.name`

3. 事件中心

``` js
import {bus} from 'wujie'
bus.$on('vue3',(data)=>{
    console.log(data,我是主应用)
})
window.$wujie.bus.$emit('vue3','我是子应用')
```


# EMP

webpack5 : Module Federation

remote
``` js
const ModuleFederatedPlugin = require('webpack/lib/container/ModuleFederationPlugin')
// webpack.config.js
new ModuleFederatedPlugin({
    name: 'remote',
    filename: 'remoteEntry.js',
    exposes: {
        './addList': './list.js'
    }
})
```
host
``` js
const ModuleFederatedPlugin = require('webpack/lib/container/ModuleFederationPlugin')
// webpack.config.js
new ModuleFederatedPlugin({
    name: 'host',
    remotes: {
        remote: 'remote@http://localhost:9001/remoteEntry.js'
    }
})
```

# 资源链接

[iframe](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)

[qiankun doc](https://qiankun.umijs.org/zh/guide)

[wujie 动机](https://zhuanlan.zhihu.com/p/551206945)

[wujie doc](https://wujie-micro.github.io/doc/guide/)

[resource.git](https://github.com/formattor/Micro-Frontend)