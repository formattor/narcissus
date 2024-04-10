# 单点登录

## Session + Cookie 模式

![SSO](https://img.qovv.cn/2024/04/10/66167418e51e7.png)

::: warning 劣势

+ 很大的应用，认证中心负载压力大

+ 子系统扩容，认证中心也要扩容，成本大

:::

## Token 模式

![SSO2](https://img2.imgtp.com/2024/04/10/ZroR3Oyh.png)

::: info

+ 无需认证中心认证

+ 失去了对用户的绝对控制

:::

## Token + Refresh Token 模式

![SSO3.png](https://img2.imgtp.com/2024/04/10/N1C8pBRN.png)

![SSO4.png](https://img2.imgtp.com/2024/04/10/I9MDnxd3.png)