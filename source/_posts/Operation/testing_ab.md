---
title: 记第一次压测
date: 2017/10/29
categories: Operation
tags:
    - Operation
    - Testing
    - todo
---

>ab(apache bench)是Apache超文本传输协议(HTTP)的性能测试工具。其设计意图是描绘当前所安装的Apache的执行性能，主要显示所安装的Apache每秒可以处理多少个请求。

它不仅可以对apache服务器进行网站访问压力测试，也可以对其它类型的服务器进行压力测试。比如nginx、tomcat、IIS等。

此次测试使用的机器为：
- Mac下2G内存双CPU虚拟机
- CentOS 6
- nginx/1.12.1
- PHP7.0
- 测试页面为YII2.0框架初始页
- 1-1000并发keep-alive

目录：
<!-- MarkdownTOC -->

- [不使用opcache缓存](#%E4%B8%8D%E4%BD%BF%E7%94%A8opcache%E7%BC%93%E5%AD%98)
- [使用opcache缓存](#%E4%BD%BF%E7%94%A8opcache%E7%BC%93%E5%AD%98)
- [响应时间比较](#%E5%93%8D%E5%BA%94%E6%97%B6%E9%97%B4%E6%AF%94%E8%BE%83)
- [下一步计划](#%E4%B8%8B%E4%B8%80%E6%AD%A5%E8%AE%A1%E5%88%92)

<!-- /MarkdownTOC -->

<!-- more -->

安装ab，ab命令在httpd-tools软件包中：

    yum install httpd-tools

安装opcache：

    yum install php70w-opcache

<a name="%E4%B8%8D%E4%BD%BF%E7%94%A8opcache%E7%BC%93%E5%AD%98"></a>
## 不使用opcache缓存

![without_opcache](/images/Operation/testing_ab/without_opcache.png)

<a name="%E4%BD%BF%E7%94%A8opcache%E7%BC%93%E5%AD%98"></a>
## 使用opcache缓存

![with_opcache](/images/Operation/testing_ab/with_opcache.png)

<a name="%E5%93%8D%E5%BA%94%E6%97%B6%E9%97%B4%E6%AF%94%E8%BE%83"></a>
## 响应时间比较

细线为缓存之后的响应时间
![response_time_chart](/images/Operation/testing_ab/response_time_chart.png)

<a name="%E4%B8%8B%E4%B8%80%E6%AD%A5%E8%AE%A1%E5%88%92"></a>
## 下一步计划

这次测试出来的数据和YII官方给到的性能存在很大差距，官方达到600+RPS，有以下几种可能：
- 框架版本，官方用的是第一版
- 缓存插件，官方用的APC
- keep-alive，官方测试时可能关闭了该功能
- 服务器性能，测试的时候cpu跑满，但是Memory还有很多盈余，但mac pro两个cpu性能应该不会差
- 缓存优化，很多人调缓存参数以提高并发，需要按官方配置再跑一跑

[官方数据](http://www.yiichina.com/performance)：
![response_time_chart](/images/Operation/testing_ab/performance_YII.png)