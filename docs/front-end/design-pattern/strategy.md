# 无策略

``` js
// 缺陷
// 1. 所有逻辑都包含在函数内
// 2. 不好修改，添加level或修改salary倍数
// 3. 复用性差
var calculateBonus = function (salary, performanceLevel) {
    if (performanceLevel == 'S') {
        return salary * 4;
    }
    if (performanceLevel == 'A') {
        return salary * 3;
    }
    if (performanceLevel == 'B') {
        return salary * 2;
    }
}

calculateBonus(2000, A);
calculateBonus(3000, S);
```

# 组合函数

``` js
// 将计算各个薪资的方法写在外边
// 
// 不过我觉得只解决了1
var performanceS = function (salary) {
    return salary * 4
}
var performanceA = function (salary) {
    return salary * 3
}
var performanceB = function (salary) {
    return salary * 2
}
var calculateBonus = function (salary, performanceLevel) {
    if (performanceLevel == 'S') {
        return performanceS(salary)
    }
    if (performanceLevel == 'A') {
        return performanceA(salary)
    }
    if (performanceLevel == 'B') {
        return performanceB(salary)
    }
}

let a = calculateBonus(2000, 'A');
let b = calculateBonus(3000, 'S');
console.log(a, b);
```

# strategy

``` js
// 传统
var performanceS = function () { }

performanceS.prototype.calculate = function (salary) {
    return salary * 4
}

var performanceA = function () { }

performanceA.prototype.calculate = function (salary) {
    return salary * 3
}

var performanceB = function () { }

performanceB.prototype.calculate = function (salary) {
    return salary * 2
}

var Bonus = function () {
    this.salary = null;
    this.strategy = null;
}

Bonus.prototype.setSalary = function (salary) {
    this.salary = salary;
}

Bonus.prototype.setStrategy = function (strategy) {
    this.strategy = strategy;
}

Bonus.prototype.getSalary = function () {
    if (!this.strategy) {
        throw new Error('no strategy')
    }
    return this.strategy.calculate(this.salary);
}

var bonus = new Bonus();

bonus.setSalary(1000);
bonus.setStrategy(new performanceA());

console.log(bonus.getSalary());

bonus.setStrategy(new performanceS());
console.log(bonus.getSalary());
```

# strategy-JS

``` js
var strategies = {
    'A': function (salary) {
        return salary * 4
    },
    'B': function (salary) {
        return salary * 3
    },
    'C': function (salary) {
        return salary * 2
    },
}

var calculateSalary = function (level, salary) {
    return strategies[level](salary)
}

console.log(calculateSalary('A', 2000));
console.log(calculateSalary('C', 5000));
```

# 应用场景

::: details 动画

``` html
<body>
    <div style="position:absolute;background:blue" id="div">我是div</div>
</body>

<script type="text/javascript">
    var tween = {
        linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        strongEaseIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        strongEaseOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        sineaseIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        sineaseOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    };

    var Animate = function (dom) {
        this.dom = dom; // 进行运动的dom 节点
        this.startTime = 0; // 动画开始时间
        this.startPos = 0; // 动画开始时，dom 节点的位置，即dom 的初始位置
        this.endPos = 0; // 动画结束时，dom 节点的位置，即dom 的目标位置
        this.propertyName = null; // dom 节点需要被改变的css 属性名
        this.easing = null; // 缓动算法
        this.duration = null; // 动画持续时间
    };


    Animate.prototype.start = function (propertyName, endPos, duration, easing) {
        this.startTime = +new Date; // 动画启动时间
        this.startPos = this.dom.getBoundingClientRect()[propertyName]; // dom 节点初始位置
        this.propertyName = propertyName; // dom 节点需要被改变的CSS 属性名
        this.endPos = endPos; // dom 节点目标位置
        this.duration = duration; // 动画持续事件
        this.easing = tween[easing]; // 缓动算法
        var self = this;
        var timeId = setInterval(function () { // 启动定时器，开始执行动画
            if (self.step() === false) { // 如果动画已结束，则清除定时器
                clearInterval(timeId);
            }
        }, 19);
    };

    Animate.prototype.step = function () {
        var t = +new Date; // 取得当前时间
        if (t >= this.startTime + this.duration) { // (1)
            this.update(this.endPos); // 更新小球的CSS 属性值
            return false;
        }
        var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
        // pos 为小球当前位置
        this.update(pos); // 更新小球的CSS 属性值
    };

    Animate.prototype.update = function (pos) {
        this.dom.style[this.propertyName] = pos + 'px';
    };

    var div = document.getElementById('div');
    var animate = new Animate(div);
    animate.start('left', 500, 1000, 'strongEaseOut');
    // animate.start('top', 1500, 500, 'sineaseOut');
</script>
```

:::

::: details 表单验证
``` html
<form action="http:// xxx.com/register" id="registerForm" method="post">
    请输入用户名：<input type="text" name="userName" />
    请输入密码：<input type="text" name="password" />
    请输入手机号码：<input type="text" name="phoneNumber" />
    <button>提交</button>
</form>
<script>
    /***********************策略对象**************************/
    var strategies = {
        isNonEmpty: function (value, errorMsg) {
            if (value === '') {
                return errorMsg;
            }
        },
        minLength: function (value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        isMobile: function (value, errorMsg) {
            if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                return errorMsg;
            }
        }
    };
    /***********************Validator 类**************************/
    var Validator = function () {
        this.cache = [];
    };
    Validator.prototype.add = function (dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function (rule) {
                var strategyAry = rule.strategy.split(':');
                var errorMsg = rule.errorMsg;
                self.cache.push(function () {
                    var strategy = strategyAry.shift();
                    strategyAry.unshift(dom.value);
                    strategyAry.push(errorMsg);
                    return strategies[strategy].apply(dom, strategyAry);
                });
            })(rule)
        }
    };
    Validator.prototype.start = function () {
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var errorMsg = validatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };
    /***********************客户调用代码**************************/
    var registerForm = document.getElementById('registerForm');
    var validataFunc = function () {
        var validator = new Validator();
        validator.add(registerForm.userName, [{
            strategy: 'isNonEmpty',
            errorMsg: '用户名不能为空'
        }, {
            strategy: 'minLength:6',
            errorMsg: '用户名长度不能小于6 位'
        }]);
        validator.add(registerForm.password, [{
            strategy: 'minLength:6',
            errorMsg: '密码长度不能小于6 位'
        }]);
        var errorMsg = validator.start();
        return errorMsg;
    }
    registerForm.onsubmit = function () {
        var errorMsg = validataFunc();
        if (errorMsg) {
            alert(errorMsg);
            return false;
        }

    };
</script>
```
:::