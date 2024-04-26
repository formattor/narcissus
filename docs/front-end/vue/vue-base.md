# ref

::: details 配置用户代码片段

vs code :manage -> User Snippets -> vue.json

```
{
	"Print to console": {
		"prefix": "vue",
		"body": [
			"<template>",
			"  <div>",
			"",
			"  </div>",
			"</template>",
			"",
			"<script setup>",
			"",
			"</script>",
			"",
			"<style lang='less' scoped>",
			"",
			"</style>",
			""
		],
		"description": "Log output to console"
	}
}

```

:::

## ref

```
import { ref } from 'vue';
import type {Ref} from 'vue'
type Man = {
  name:string
}
// const man = ref<Man>({name:'zys'})
const man:Ref<Man> = ref({name:'zys'})

const change = ()=>{
  man.value.name = 'zzz'
  console.log(man);
}
```

```
//获取dom元素
<div ref="dom"></div>
//与标签中绑定的ref名称保持一致
const dom = ref<HTMLDivElement>();
```

## isRef

`isRef(man) // true`

## shallowRef

浅层次的响应式,只响应到`.value.xxx`

不能与ref同时使用，否则会变成深度响应式

## triggerRef

`triggerRef(man)` 会强制shallowRef的深度响应式更新

## customRef

::: details 自定义ref

```
function MyRef<T>(value:T){
  let timer:any;
  return customRef((track,trigger)=>{
    return {
      get(){
        track()
        return value
      },
      set(newValue){
        clearTimeout(timer)
        timer = setTimeout(()=>{
          value = newValue
          trigger()
        },1000)
      }
    }
  })
}

const obj = MyRef<string>('customRef-zys')

```
:::

触发响应式如果调接口可以做防抖处理

::: tip 浏览器方便观察ref对象

设置->首选项->控制台->自定义格式化工具

::: 

## 源码

> https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts

```
ref(支持多重类型重载){
  createRef(value,false)
}

createRef(value,shallow){
  isRef(value) return value;
  return RefImpl;
}

RefImpl {
  isShallow?value:toReactive()
}

toReactive(value){
  isObject(value)?reactive(value):value;
}

shallowRef(value){
  createRef(value,true)
}
```

# reactive

`reactive<T extends object>`

只支持引用类型

读取赋值不需要`.value`

不能直接赋值，否则会破坏响应式对象

  + push加解构 `arr.push(...[1,2,3])`

  + 添加数组对象作为属性

## readonly

`readonly(val)` 无法赋值，但val赋值会修改readonly对象

## shallowReactive

到第一层 `val.xxx = xxx`

同样和reactive一起使用会被影响

## 源码

[reactive](https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts)

```
reactive(value){
  isReadonly return value;
  return createReactiveObject(value)
}

createReactiveObject(value){
  !isObject return value;
}
```

# to

> https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts

## toRef

`toRef(obj,key)` 只能作用于响应式对象，解构对象返回其中属性

## toRefs

``` js
toRefs=<T extends object>(obj:T)=>{
  const map:any = {}
  for(let key in obj){
    map[key] = toRef(obj,key)]
  }
}
```

## toRaw

`toRaw(reactiveObj)` 变成原始对象

通过属性`__v_raw`来获取原始值

# computed

1. 选项式写法

```
const name = computed<string>(()=>{
  get()=>{
    return firstName.value + ' ' + lastName.value;
  },
  set(newVal)=>{

  }
})
```

2. 函数式写法

```
const name = computed(()=>{ return firstName.value + ' ' + lastName.value; })
```

name.value is `readyonly`

<hr>

场景：总价，搜索等

## 源码

// todo

> https://github.com/vuejs/core/blob/main/packages/reactivity/src/computed.ts

# watch

监听响应式数据的变化

单个 `watch(val,(newVal,oldVal)=>{})`

多个 `watch([val,val2],(newVal,oldVal)=>{}，{deep:true})`

+ `deep:true`为深度监听,但新值和旧值是一样的

+ `immediate:true` 默认先执行一次

+ `flush: "pre"` pre组件更新之前，sync同步，post逐渐更新之后

reactive不需要开启deep，因为已经隐式实现了

监听对象单一属性 `watch(()=>man.name,(newVal,oldVal)=>{})` 使用回调

::: warning 
如何分开监听呢，因为只有一个回调函数返回所有的被监听者
:::

## 源码

> https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiWatch.ts

```
watch(){
  doWatch()
}

doWatch(){
  判断source的类型
}
```

# watchEffect

``` js
const stop = watchEffect((oninvalidate)=>{
  console.log(man.value)
  console.log(man2.value)
  oninvalidate(()=>{
    // 在监听新值变化之前触发回调
    console.log('before')
  })
},{
  flush:'post', // dom更新之后获取
  onTrigger(e){
    debugger //调试变化
  }
})

stop(); // 停止监听

```

# component & lifecycle

setup语法糖没有`beforeCreate`&`created`

|lifecycle|function|
|---|---|
|beforeCreate|创建之前,setup替代|
|created|创建之后,setup替代|
|onBeforeMount|挂载之前,无DOM|
|onMounted|挂载之后,有DOM|
|onBeforeUpdate|更新之前,DOM没更新|
|onUpdated|更新之后,DOM已更新|
|onBeforeUnmount|卸载之前|
|onUnmounted|卸载之后|
|onRenderTracked|响应式依赖调试|
|onRenderTriggered|响应式触发调试|

getCurrentInstance()获取当前组件实例

## 源码

> https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiWatch.ts

> https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts

```
createHook(lifecycle)
```


# 组件传值

## 父传子

+ 两种方式

+ ts特有的没人没传默认值

``` js
// 父组件
<Child :title = name ></Child>

let name = 123;
```

``` js
// 子组件
// 01
const props = defineProps({
  title:{
    type:String,
    default:''
  }
})

// 02
const props = defineProps<{
  title:string
}>()

// props.title

// ts特有的没传默认值，withDefaults
withDefaults(defineProps<{
  title:string
}>(),{
  title: () => 'zzz'
})

```

## 子传父

+ 我认为是发布订阅，子组件发布，父组件订阅

``` js
// 父组件

<Child @child-click="getChild"></Child>

const getChild = (...args) => {}

```

``` js
// 子组件
<button @click="handleClick"></button>

// 01
const emit = defineEmits(['child-click'])
// 02
const emit = defineEmits<{
  (e: 'child-click', ...args: any[]):void
}>()

const handleClick = () => {
  emit('child-click',...args)
}

```

`defineExpose`可以在父组件调用子组件属性和方法