
---

title: Hexo 安装笔记 
date: 2017-06-27
tag: Hexo

---


在本地搭建Hexo并添加文章

操作环境： Windows 7 64bit

hexo是一款基于Node.js的静态博客框架

<!-- MarkdownTOC -->

- [1. 安装Node.js](#1-安装nodejs)
    - [下载并安装](#下载并安装)
    - [检查是否成功](#检查是否成功)
    - [可选项：换源](#可选项：换源)
- [2. 安装Hexo](#2-安装hexo)
    - [创建文件夹](#创建文件夹)
    - [安装](#安装)
- [3. 使用Hexo](#3-使用hexo)
    - [初始化](#初始化)
    - [部署到本地服务器](#部署到本地服务器)
    - [启动服务器](#启动服务器)
- [4. 添加文章](#4-添加文章)
- [5. Hexo配置](#5-hexo配置)

<!-- /MarkdownTOC -->

<a name="1-安装nodejs"></a>
## 1. 安装Node.js

<a name="下载并安装"></a>
### 下载并安装

[node-v4.2.3-x64.msi](https://nodejs.org/dist/v4.2.3/node-v4.2.3-x64.msi)

默认安装即可

<a name="检查是否成功"></a>
### 检查是否成功

启动cmd，任意路径下运行以下命令：

```
node -v     // 检查node版本
npm -v      // 检查npm版本

```

我的结果如下：

```
    Microsoft Windows [版本 6.1.7601]
    版权所有 (c) 2009 Microsoft Corporation。保留所有权利。

    C:\Users\John>node -v
    v8.1.2

    C:\Users\John>npm -v
    5.0.3
```

如何启动cmd：[CMD模式怎么进？](https://zhidao.baidu.com/question/266195062.html)

<a name="可选项：换源"></a>
### 可选项：换源

npm的源在国外，所以国内用户需要换源，**否则一些包无法安装**。

这里选择淘宝的源，运行下面两个命令之一：

```
    npm --registry https://registry.npm.taobao.org install express      // 临时换源
    npm config set registry https://registry.npm.taobao.org             // 永久换源
```

更多请参考：[npm换源](http://riny.net/2014/cnpm/)

<a name="2-安装hexo"></a>
## 2. 安装Hexo

<a name="创建文件夹"></a>
### 创建文件夹

需要为Hexo创建一个 **空文件夹**

然后进入该文件夹

我建立的文件夹：D:\Hexo

<a name="安装"></a>
### 安装

在刚刚建立的文件夹中启动cmd控制台

> 打开该文件夹，在空白位置按住Shift，按下鼠标右键，选择‘在此处打开控制台’。
> 
> 也可以cd到该文件夹。

运行以下命令：

> `WARN`警告可以无视

```
    npm install hexo-cli -g
    npm install hexo --save
    hexo -v     // 检查Hexo版本
```

我的版本信息：

```
    C:\Users\John>hexo -v
    hexo-cli: 1.0.3
    os: Windows_NT 6.1.7601 win32 ia32
    http_parser: 2.7.0
    node: 8.1.2
    v8: 5.8.283.41
    uv: 1.12.0
    zlib: 1.2.11
    ares: 1.10.1-DEV
    modules: 57
    openssl: 1.0.2l
    icu: 59.1
    unicode: 9.0
    cldr: 31.0.1
    tz: 2017b
```

<a name="3-使用hexo"></a>
## 3. 使用Hexo

> 该部分cmd操作均在之前建立的Hexo目录下

<a name="初始化"></a>
### 初始化

```
    hexo init       // 初始化
    npm install     // 安装依赖
```

<a name="部署到本地服务器"></a>
### 部署到本地服务器

```
    hexo g      // 完整命令为 hexo generate
    hexo d      // 完整命令为 hexo deploy
```

<a name="启动服务器"></a>
### 启动服务器

```
    hexo s      // 完整命令为 hexo server
```

看到如下字样：

```
    Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

最小化cmd，不要关闭控制台。

打开浏览器，地址栏输入[http://localhost:4000/](http://localhost:4000/)并回车，
即可看到Hexo首页，同时有一篇默认文档`Hello World`

<a name="4-添加文章"></a>
## 4. 添加文章

在Hexo目录下找到 **source\\_posts\\** ，并在其中新建Markdown文本即可，服务器会自动加载。

如这篇文章的路径：D:\Hexo\source\\_posts\hexo-install.md

<a name="5-hexo配置"></a>
## 5. Hexo配置

请参考[hexo教程系列——hexo配置教程 ](http://blog.csdn.net/xuezhisdc/article/details/53130383)