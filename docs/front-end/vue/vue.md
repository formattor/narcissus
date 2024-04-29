# Vue3 update

[学习视频](https://www.bilibili.com/video/BV1dS4y1y7vd/?spm_id_from=333.999.0.0&vd_source=ba4cef6c44c3430b2a8024337b31925b)

[配套文档](https://xiaoman.blog.csdn.net/category_11618172_2.html)

::: warning 链接
[认识vue](https://xiaoman.blog.csdn.net/article/details/122768533)
::: 

::: info 链接

[vue3](https://cn.vuejs.org/)

[vue2](https://cn.vuejs.org/)

[vue3源码](https://github.com/vuejs/vue-next)

[vue2源码](https://github.com/vuejs/vue)

:::


+ 重写双向绑定

    + vue2对数组不友好，劫持数组方法重写，修改数组length监听不到

![vue2](https://img.qovv.cn/2024/04/14/661ab30bad6d4.png)

![vue3](https://img.qovv.cn/2024/04/14/661ab3623ec3e.png)

+ VDOM性能提升

    + [静态标记](https://template-explorer.vuejs.org/)

+ Fragments

    + 支持多个根节点

    + 支持render JSX写法

+ Tree-Shaking

+ Composition API

# config environment

::: warning 链接
[配置环境](https://xiaoman.blog.csdn.net/article/details/122769982)
::: 

[node.cn](https://nodejs.cn/)

[node.en](https://nodejs.org/en/)

[nvm](https://github.com/coreybutler/nvm-windows/releases)

```
nvm list

nvm install xx.xx.xx

nvm uninstall xx.xx.xx

nvm use xx.xx.xx
```

vite构建项目
```
npm init vite@latest
```
vue cli构建项目
```
npm init vue@latest
```

::: warning 链接
[npm](https://xiaoman.blog.csdn.net/article/details/122771007)
::: 

::: tip npm run dev的过程

+ npm run dev

+ package.json:scripts:dev

+ vite:package.json:bin:vite:bin/vite.js

+ node_modules/.bin/

    + vite // unix shell

    + vite.cmd // windows

    + vite.ps1 // 跨平台

+ 如果没有上述文件，回去npm的本地仓库找

+ 本地仓库没有就会去环境变量中找，否则报错

:::

# vue基础语法

::: warning 链接
[基础语法](https://xiaoman.blog.csdn.net/article/details/122773486)
::: 

|语法|补充说明|
|---|---|
|插值|支持运算|
|v-if|注释节点|
|v-show|display:none;|
|`@[variable]="someEvent";` `variable = 'click'`|动态绑定事件|
|`@[variable].stop="someEvent"` `.prevent` `.once` ...|阻止冒泡 ...|
|v-memo|搭配v-for使用，避免重新渲染|

# virtual DOM

通过js生成的AST节点树，操控js要比直接操控DOM快。

# Diff算法

::: warning 链接
[diff](https://xiaoman.blog.csdn.net/article/details/122778560)
::: 

[![Diff](https://img.qovv.cn/2024/04/17/661ea0f35504b.png)](https://img.qovv.cn/2024/04/17/661ea0f35504b.png)

## 无key

![01_diff.png](http://47.116.165.184/i/2024/04/26/662b5d7db7805.png)

```
// 三步
patchUnkeyedChildren{
    patch //对比节点
    unmountChildren //删除节点
    mountChildren //添加节点
}
```

一一替换，多了添加，少了删除。

不变的节点也会被替换，性能浪费。

## 有key

![01_diffKey.png](https://img.qovv.cn/2024/04/17/661fbbde7f6d2.png)

```
// 五步
patchKeyedChildren{
    isSameVNodeType //前序对比算法，判断type和key是否相同，不同跳出循环进行尾序算法
    isSameVNodeType //尾序对比算法，判断type和key是否相同
    patch //多了新增
    unmount //少了卸载

    //无序
    //构建新映射关系
    //记录新节点在旧节点中的位置信息
    //多余节点删掉
    getSequence{ //最长递增子序列递增算法，贪心+二分
        //数组索引都为1，从左到右一一对比
        //左大右小索引不变，左小右大索引+1
        //继续往右，找出比该值小的最大索引+1
    }
    // 不在子序列就移动，否则跳过
}
```

# 响应式原理

// todo


# BEM

// todo

Block-Element__Modify `el-input__wrapper--primary`
