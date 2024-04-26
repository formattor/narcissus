# 常用命令

|script|description|
|--|--|
|cat /etc/os-release|查看系统信息|

# 部署网站

## 安装宝塔

[宝塔安装官网](https://www.bt.cn/new/download.html)

[lsky pro](https://docs.lsky.pro/)

1. centos安装命令

``` shell
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
```

2. 安装完成选择打开外网面板地址

3. 打不开是由于端口号没有放行

    + 创建安全组，将端口加入其中

    + 将安全组加入实例

4. 默认安装LNMP

5. 安装php扩展
    
    + fileinfo

    + imagemagick

6. 禁用php函数

7. 添加站点,域名需要解析，ip不需要

8. 添加数据库

9. 打开站点目录，清空且上传图床源码

    + [蓝空图床](https://github.com/lsky-org/lsky-pro)

10. 设置网站运行目录为public

11. 配置伪静态

```
location / {
  if (!-e $request_filename) {
    rewrite ^(.*)$ /index.php?s=$1 last; break;
  }
}
```

12. 打开站点

13. 选择相关数据库

14. 完成！！！