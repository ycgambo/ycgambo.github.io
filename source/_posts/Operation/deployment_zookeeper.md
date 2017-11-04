---
title: ZooKeeper分布式配置踩坑记
date: 2017/11/02 15:11:23
categories: Operation
tags:
    - Operation
    - Deployment
    - Distributed
---

> ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.  

ZooKeeper是一个集中式服务。它可以维护配置信息、支持命名空间、提供分布式同步和组服务。

换句话说，ZooKeeper：
- 用来维护配置信息
- 配置被管理在命名空间中
- 可以扩展，提供分布式服务
- 支持分布式同步：一处修改，其他机器同步更新

这次配置出坑比较久，Mark一下。

目录：
<!-- MarkdownTOC -->

- [坑1：主机数要求至少3台](#%E5%9D%911%EF%BC%9A%E4%B8%BB%E6%9C%BA%E6%95%B0%E8%A6%81%E6%B1%82%E8%87%B3%E5%B0%913%E5%8F%B0)
- [坑2：myid文件](#%E5%9D%912%EF%BC%9Amyid%E6%96%87%E4%BB%B6)
- [坑3：网络不通](#%E5%9D%913%EF%BC%9A%E7%BD%91%E7%BB%9C%E4%B8%8D%E9%80%9A)
    - [1. 端口是否配置正确](#1-%E7%AB%AF%E5%8F%A3%E6%98%AF%E5%90%A6%E9%85%8D%E7%BD%AE%E6%AD%A3%E7%A1%AE)
    - [2. hosts映射是否正确](#2-hosts%E6%98%A0%E5%B0%84%E6%98%AF%E5%90%A6%E6%AD%A3%E7%A1%AE)
    - [3. 服务器防火墙](#3-%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%98%B2%E7%81%AB%E5%A2%99)
    - [4. 服务器供应商安全策略](#4-%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%BE%9B%E5%BA%94%E5%95%86%E5%AE%89%E5%85%A8%E7%AD%96%E7%95%A5)

<!-- /MarkdownTOC -->

<!-- more -->

运行zkServer start后，当前路径会生成zookeeper.out文件，其中保存了启动日志。

<a name="%E5%9D%911%EF%BC%9A%E4%B8%BB%E6%9C%BA%E6%95%B0%E8%A6%81%E6%B1%82%E8%87%B3%E5%B0%913%E5%8F%B0"></a>
## 坑1：主机数要求至少3台

ZooKeeper会选举一台机器作为leader，其它机器作为follower。**如果希望F台机器挂掉时仍能提供服务，ZooKeeper集群至少需要2F+1台机器。**如果有3台机器，可以挂1台；4台可以挂1台；5台可以挂2台；6台可以挂2台。

所以3台机器可以拿出来一台维护，但是不能承担维护时另外两台中任何一台挂掉。而5台机器可以在其中一台维护时，仍然具有容灾能力。

<a name="%E5%9D%912%EF%BC%9Amyid%E6%96%87%E4%BB%B6"></a>
## 坑2：myid文件

分布式的ZooKeeper在配置好zoo.cfg之后，还需要配置myid文件。

myid文件应该放在zoo.cfg中dataDir下，值为zoo.cfg中server.id所对应的这台机器的id。

<a name="%E5%9D%913%EF%BC%9A%E7%BD%91%E7%BB%9C%E4%B8%8D%E9%80%9A"></a>
## 坑3：网络不通

依次排查：

<a name="1-%E7%AB%AF%E5%8F%A3%E6%98%AF%E5%90%A6%E9%85%8D%E7%BD%AE%E6%AD%A3%E7%A1%AE"></a>
### 1. 端口是否配置正确

- 检查zoo.cfg文件，端口是否冲突
- 检查myid文件和zoo.cfg配置是否一致
- 启动zkServer后，查看是否在监听相应端口

该命令查看java监听的端口，会显示客户端端口port_0和同步端口port_2，如果是leader，还会有port_1。对应zoo.cfg中`clientPort=port_0`、`server.x=host_x:port_1:port_2`。
```
> netstat -anp |grep LISTEN|grep java
tcp        0      0 0.0.0.0:port_0                0.0.0.0:*                   LISTEN      19641/java
tcp        0      0 0.0.0.0:port_2                0.0.0.0:*                   LISTEN      19641/java
```

<a name="2-hosts%E6%98%A0%E5%B0%84%E6%98%AF%E5%90%A6%E6%AD%A3%E7%A1%AE"></a>
### 2. hosts映射是否正确

如果在zoo.cfg中使用了别名，应该在hosts中设置。

**本机别名对应的hosts应设为0.0.0.0**，因此每台机器的hosts都应该略有不同。

<a name="3-%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%98%B2%E7%81%AB%E5%A2%99"></a>
### 3. 服务器防火墙

确保集群之间相互没有被墙

<a name="4-%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%BE%9B%E5%BA%94%E5%95%86%E5%AE%89%E5%85%A8%E7%AD%96%E7%95%A5"></a>
### 4. 服务器供应商安全策略

服务器供应商的安全策略可能存在端口限制

