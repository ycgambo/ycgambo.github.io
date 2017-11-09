---
title: PHP Socket
date: 2017/11/10 00:11:34
categories: PHP
tags:
    - PHP
    - Extension
    - Socket
---

挂念PHP的Socket扩展好几天了，只看不练，心里痒痒，于是决定写一下代码。本文实现了一款简单的在线聊天系统，对理解socket通信很有好处。Socket还需要一些Http知识，我这里就不补充了。

目录：
<!-- MarkdownTOC -->

- [支持单一连接的服务端](#%E6%94%AF%E6%8C%81%E5%8D%95%E4%B8%80%E8%BF%9E%E6%8E%A5%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AB%AF)
- [支持多个连接的服务端](#%E6%94%AF%E6%8C%81%E5%A4%9A%E4%B8%AA%E8%BF%9E%E6%8E%A5%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AB%AF)
- [服务端调度客户端通信](#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E8%B0%83%E5%BA%A6%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%80%9A%E4%BF%A1)

<!-- /MarkdownTOC -->

<!-- more -->

> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>

<a name="%E6%94%AF%E6%8C%81%E5%8D%95%E4%B8%80%E8%BF%9E%E6%8E%A5%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AB%AF"></a>
## 支持单一连接的服务端

这里参考[Socket example: Simple TCP/IP server](http://php.net/manual/en/sockets.examples.php)构建了一个简单的服务器，把客户端发来的消息返回给客户端，它只能支持单一连接。当客户端A接入服务端时，其它客户端的接入会排队，当客户端A断开连接后，其它客户端才能得到响应。

完整代码如下：

```php
/* 设置脚本时间限制为无限 */
set_time_limit(0);
/* 自动刷新输出缓存 */
ob_implicit_flush();

/* 设置监听地址和端口 */
$address = '0.0.0.0';
$port = 10000;

/* 创建socket */
if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 绑定socket监听的地址和端口 */
if (socket_bind($sock, $address, $port) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 监听socket时，允许5个socket排队等待 */
if (socket_listen($sock, 5) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 无限循环，依次监听请求 */
do {
    /* 此处会阻塞直到$sock接收到消息，为其创建socket */
    if (($msgsock = socket_accept($sock)) === false) {
        echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
        break;
    }

    /* 客户端连入，显示欢迎信息 */
    $msg = "Welcome to the PHP Test Server." . PHP_EOL;
    socket_write($msgsock, $msg, strlen($msg));

    do {
        /* 读取消息 */
        if (false === ($buf = socket_read($msgsock, 2048, PHP_NORMAL_READ))) {
            echo socket_strerror(socket_last_error($msgsock)) . PHP_EOL;
            break 2;    // 系统异常，中断服务
        }
        if (!$buf = trim($buf)) {
            continue;   // 忽略空消息
        }
        if ($buf == 'quit') {
            break;      // 客户端请求中断通信
        }

        /* 向客户端回显消息，并在服务端输出 */
        $talkback = "You said '$buf'" . PHP_EOL;
        socket_write($msgsock, $talkback, strlen($talkback));
        echo "$buf" . PHP_EOL;
    } while (true);

    /* 关闭当前消息通道 */
    socket_close($msgsock);
} while (true);

/* 停止socket监听 */
socket_close($sock);
```

循环中创建的msgsock和循环外部的socket是两种不同的资源类型，具体可参看[socket_accept](http://php.net/manual/en/function.socket-accept.php)

此时在服务端启动脚本：

    > php -f socket_server.php

然后用另一台机器作为客户端，请求通信：

```
> telnet host port
Trying 119.28.24.83...
Connected to hongkong.
Escape character is '^]'.
Welcome to the PHP Test Server.

```

之后客户端的消息会被服务端处理并回显，服务端也会输出该消息。客户端输入`quit`即可中断通信，如果另一台客户端B也连接了服务，但处于排队状态，则可以看到B之前发送的消息得到了回显。

至此，我们成功构建了一个简单的服务，测试了socket通信。接下来，我们让服务端同时处理多个连接。

<a name="%E6%94%AF%E6%8C%81%E5%A4%9A%E4%B8%AA%E8%BF%9E%E6%8E%A5%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AB%AF"></a>
## 支持多个连接的服务端

该功能主要利用了[socket_select函数](http://php.net/manual/en/function.socket-select.php)。**该函数接收读、写、异常三个socket数组，观察它们对应状态在指定时间内是否发生改变，将它们的值修改为那些相应状态改变的socket，返回改变的socket的数目。**

完整代码如下：

```php
/* 设置脚本时间限制为无限 */
set_time_limit(0);
/* 自动刷新输出缓存 */
ob_implicit_flush();

/* 设置监听地址和端口 */
$address = '0.0.0.0';
$port = 10000;

/* 创建socket */
if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 绑定socket监听的地址和端口 */
if (socket_bind($sock, $address, $port) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 监听socket时，允许5个socket排队等待 */
if (socket_listen($sock, 5) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

$clients = array();     // 保存所有客户端

/* 无限循环，不断观察通信 */
do {
    $reads = $clients;      // 所有客户端
    $reads[] = $sock;       // 当前socket

    /* 阻塞直到有通信可读 */
    if (socket_select($reads, $write = NULL, $except = NULL, 0) == 0) {
        continue;
    }

    /* 该通信是主socket，说明有新客户端连入 */
    if (in_array($sock, $reads)) {
        /* 查看活跃的通信，为其创建socket */
        if (($msgsock = socket_accept($sock)) === false) {
            echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
            break;
        }

        /* 客户端连入，显示欢迎信息 */
        $msg = "Welcome to the PHP Test Server." . PHP_EOL;
        socket_write($msgsock, $msg, strlen($msg));

        /* 跟踪新客户端 */
        $clients[] = $msgsock;

        /* 新连接已建立，继续观察通信 */
        continue;
    }

    /* 该通信是普通消息，遍历所有客户端，查看被截获的通信 */
    foreach ($clients as $id => $client) {
        if (in_array($client, $reads)) {
            /* 读取消息 */
            if (false === ($buf = socket_read($client, 2048, PHP_NORMAL_READ))) {
                echo socket_strerror(socket_last_error($client)) . PHP_EOL;
                break 2;    // 系统异常，中断服务
            }
            if (!$buf = trim($buf)) {
                continue;   // 忽略空消息
            }
            if ($buf == 'quit') {
                /* 客户端请求中断通信 */
                socket_close($client);  // 关闭当前消息通道
                unset($clients[$id]);   // 清理活跃客户端记录
                break;
            }

            /* 向客户端回显消息，并在服务端输出 */
            $talkback = "You said '$buf'" . PHP_EOL;
            socket_write($msgsock, $talkback, strlen($talkback));
            echo "$buf" . PHP_EOL;
        }
    }
} while (true);

/* 停止socket监听 */
socket_close($sock);
```

这个实现主要利用了以下几点：

- 利用对`socket_select`函数对`reads`数组的修改，实现了区分新连接和普通消息。
- 将所有客户端保存在数组中，监控他们是否活跃，利用遍历找到活跃通信。
- 采用`socket_select`阻塞程序，可以防止`socket_accept`阻塞而阻断其它客户端。

在服务端启动脚本后，就可以在不同的客户端连接服务端进行测试了，不再赘述。

<a name="%E6%9C%8D%E5%8A%A1%E7%AB%AF%E8%B0%83%E5%BA%A6%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%80%9A%E4%BF%A1"></a>
## 服务端调度客户端通信

上面的实现，客户端都只能和服务端通信，这里只需稍加扩展，客户端之间就能互相通信了。

有以下几种思路：
- 点对点通信，客户端指定对方id，服务端处理后投放到该id
- 群组通信，采用一定的分组策略，将客户端划分到不同的组中，通信时指定组id，向该组广播，或同时指定组id和客户端id单点通信

这里实现一个简单的点对点：

```php
/* 设置脚本时间限制为无限 */
set_time_limit(0);
/* 自动刷新输出缓存 */
ob_implicit_flush();

/* 设置监听地址和端口 */
$address = '0.0.0.0';
$port = 10000;

/* 创建socket */
if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 绑定socket监听的地址和端口 */
if (socket_bind($sock, $address, $port) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

/* 监听socket时，允许5个socket排队等待 */
if (socket_listen($sock, 5) === false) {
    echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
}

$clients = array();     // 保存所有客户端
$users = array();       // 保存用户uid
$users_rvt = array();   // users数组的倒排索引
$to = array();          // 保存用户当前通信伙伴

/* 无限循环，不断观察通信 */
do {
    $reads = $clients;      // 所有客户端
    $reads[] = $sock;       // 当前socket

    /* 阻塞直到有通信可读 */
    if (socket_select($reads, $write = NULL, $except = NULL, 0) == 0) {
        continue;
    }

    /* 该通信是主socket，说明有新客户端连入 */
    if (in_array($sock, $reads)) {
        /* 查看活跃的通信，为其创建socket */
        if (($msgsock = socket_accept($sock)) === false) {
            echo socket_strerror(socket_last_error($sock)) . PHP_EOL;
            break;
        }

        /* 客户端连入，显示欢迎信息 */
        $msg = "Welcome to the PHP Test Server." . PHP_EOL;
        socket_write($msgsock, $msg, strlen($msg));

        /* 跟踪新客户端 */
        $next_index = 'client_' . count($clients);  // 数字索引unset后，索引重排会导致消息发错socket
        $clients[$next_index] = $msgsock;

        /* 新连接已建立，继续观察通信 */
        continue;
    }

    /* 该通信是普通消息，遍历所有客户端，查看被截获的通信 */
    foreach ($clients as $id => $client) {
        if (in_array($client, $reads)) {
            $talkback = '';
            /* 读取消息 */
            if (false === ($buf = socket_read($client, 2048, PHP_NORMAL_READ))) {
                echo socket_strerror(socket_last_error($client)) . PHP_EOL;
                break 2;    // 系统异常，中断服务
            }
            if (!$buf = trim($buf)) {
                continue;   // 忽略空消息
            }
            if (substr($buf, 0, 3) == 'uid' && ($uid = substr($buf, 4))) {
                if (!isset($users_rvt[$uid])) {
                    $users[$id] = $uid;
                    $users_rvt[$uid] = $id;
                    $to[$id] = $uid;
                    $talkback = 'OK! please set your partner(yourself as default).' . PHP_EOL;
                } else {
                    $talkback = 'uid already in use.' . PHP_EOL;
                }
                socket_write($client, $talkback, strlen($talkback));
                continue;
            } elseif (substr($buf, 0, 3) == 'to:' && ($partner = substr($buf, 4))) {
                $to[$id] = $partner;
                $talkback = 'OK! please send your message.' . PHP_EOL;
                socket_write($client, $talkback, strlen($talkback));
                continue;
            } elseif ($buf == 'quit') {
                /* 客户端请求中断通信 */
                socket_close($client);  // 关闭当前消息通道
                unset($clients[$id]);   // 清理活跃客户端记录
                unset($users[$id]);     // 用户下线
                break;
            }

            /* 转发消息 */
            if (isset($users[$id])) {
                if (isset($to[$id])) {
                    if (isset($users_rvt[$to[$id]]) && ($client_rcv = $users_rvt[$to[$id]]) && isset($users[$client_rcv]) && isset($clients[$client_rcv])) {
                        $sendto = $users[$id] . " said '$buf'" . PHP_EOL;
                        echo $users[$id] . ' sent a message to ' . $to[$id] . PHP_EOL;
                        socket_send($clients[$users_rvt[$to[$id]]], $sendto, strlen($sendto), MSG_EOF);
                    } else {
                        $talkback = 'user ' . $to[$id] . ' is off-line now.' . PHP_EOL;
                    }
                } else {
                    $talkback = 'please set your partner. to: xxx' . PHP_EOL;
                }
            } else {
                $talkback = 'please set your uid. uid xxx' . PHP_EOL;
            }
            if (!empty($talkback)) {
                socket_write($client, $talkback, strlen($talkback));
            }
        }
    }
} while (true);

/* 停止socket监听 */
socket_close($sock);
```

以上代码简单实现了点对点通信功能，要注意一点：

`clients`数组的索引变成了字符串索引，目的是为了避免客户端下线时`unset`操作导致索引重排，进而使`users_rvt`所保存的状态过期，可能出现”串台“现象

测试如下：

先在服务端启动脚本；

客户端A连接服务，设置自己的uid，尝试与234通信：
![234OffLine](/images/PHP/extension_socket/234OffLine.png)

然后启动客户端B，A再次尝试通信，成功发送 *hello again*：
![234Up](/images/PHP/extension_socket/234Up.png)

关闭客户端B，A再次尝试通信：
![234OffLineAgain](/images/PHP/extension_socket/234OffLineAgain.png)

服务端通知：
![severNotify](/images/PHP/extension_socket/severNotify.png)