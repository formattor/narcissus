在中间层做一些处理

# 无代理

``` js
var Flower = function () { }

var me = {
    sendFlower: function (target) {
        var flower = new Flower();
        target.receiveFlower(flower)
    }
}

var her = {
    receiveFlower: function (flower) {
        console.log('收到', flower);
    }
}

me.sendFlower(her);
```

# 代理

``` js
var Flower = function () { }

var me = {
    sendFlower: function (target) {
        var flower = new Flower();
        target.receiveFlower(flower)
    }
}

var her = {
    receiveFlower: function (flower) {
        console.log('收到', flower);
    }
}

var friend = {
    receiveFlower: function (flower) {
        her.receiveFlower(flower)
    }
}

me.sendFlower(friend);
```

# 代理模式

+ 保护代理：根据情况来决定是否需要代理

+ 虚拟代理：在符合情况的时候才做下一步操作

``` js
var Flower = function () { }

var me = {
    sendFlower: function (target) {
        // var flower = new Flower();
        target.receiveFlower()
    }
}

var her = {
    receiveFlower: function (flower) {
        console.log('收到', flower);
    },
    listenGoodMood: function (fn) {
        setTimeout(() => {
            fn();
        }, 5000);
    }
}

var friend = {
    receiveFlower: function () {
        // her.receiveFlower(flower)
        // 01. filter the condition --- protect proxy mode
        her.listenGoodMood(function () {
            // 02. decrease the spend --- virtual proxy mode
            let flower = new Flower()
            her.receiveFlower(flower)
        })
    }
}

me.sendFlower(friend);
```

# preloading

``` js
var myImage = (function () {
    var imageNode = document.createElement('img')
    document.body.appendChild(imageNode);

    return {
        setSrc: function (src) {
            imageNode.src = src;
        }
    }
})()

// myImage.setSrc('./resource/1.jpg')

var proxyImg = (function () {
    var img = new Image;
    img.onload = function () {
        myImage.setSrc(this.src)
    }
    return {
        setSrc: function (src) {
            myImage.setSrc('./resource/2.jpg')
            img.src = src;
        }
    }
})()

proxyImg.setSrc('./resource/1.jpg')
```

# 缓存代理

``` js
var mult = function () {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return a;
};
// let a = mult(2, 3); // 输出：6
// let b = mult(2, 3, 4); // 输出：24

// console.log(a, b);

var proxyMult = (function () {
    var cache = {};
    return function () {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args]
        }
        return cache[args] = mult.apply(this, arguments);
    }
})()

console.log(proxyMult(1, 2, 3, 4));
console.log(proxyMult(1, 2, 3, 4));
```