# 应用通信

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
