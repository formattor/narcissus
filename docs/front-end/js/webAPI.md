# window.requestAnimationFrame()

::: details
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .frame{
            width: 100px;
            height: 100px;
            position: relative;
        }
        .f1{
            top: 5px;
            background-color: palegoldenrod;
        }
        .f2{
            top: 20px;
            background-color: paleturquoise;
        }
    </style>
</head>
<body>
    <div class="frame f1"></div>
    <div class="frame f2"></div>
    <script>
        let f1 = document.querySelector('.f1');
        let f2 = document.querySelector('.f2');
        function runF1(){
            let left = 0;
            let timer = setInterval(()=>{
                if(left >= 300){
                    clearInterval(timer);
                    runF1();
                }else{
                    f1.style.left = (++left) + 'px';
                }
            },16.7)
        }

        function runF2(){
            let left = 0;
            function cb(){
                if(left >= 300){
                    runF2();
                }else{
                    f2.style.left = (++left) + 'px';
                    window.requestAnimationFrame(cb);
                }
            }
            window.requestAnimationFrame(cb);
        }

        runF1();
        runF2();
    </script>
</body>
</html>
```
:::


::: danger 为什么setInterval会卡顿

显示屏幕刷新率一般为60HZ，也就是1000/60 = 16.7ms

1. setInterval如果默认为10ms调用一次

2. 根据eventLoop,setInteral在第10ms的时候不一定能执行

3. 就算执行成功，那么10ms后，代码执行，但浏览器在第16.7ms渲染

4. 第二次，20ms后，代码执行，由于浏览器在第33.4ms渲染，中间setInterval又在30ms的时候执行一次

5. 因此导致了第20ms的位置帧数缺失，造成卡顿

:::

::: tip requestAnimationFrame优点

1. 浏览器在16.7ms渲染，不会出现卡顿

2. 运行在后台或者隐藏的`iframe`中时，会暂停调用，提升性能和电池寿命

:::