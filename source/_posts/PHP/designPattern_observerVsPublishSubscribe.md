---
title: PHP观察者模式与发布订阅模式
date: 2017/10/28
categories: PHP
tags:
    - PHP
    - 设计模式
---

>观察者模式定义了对象间的一种一对多的依赖关系，以便一个对象的状态发生变化时，所有依赖于它的对象都得到通知并自动刷新。

发布订阅模式实现了相同的功能，所以很多人认为观察者模式和发布订阅模式是一种A和A的别名的关系，其实不然：
- 观察者模式
    + 被观察者中注册了许多观察者，因此被观察者需要关心有哪些观察者需要注册
    + 观察者拥有被观察者的引用，因此观察者可以读取、检测甚至更改被观察者的状态
- 发布订阅模式
    + 发布者不关心有多少订阅者，不关心他们的状态，只用通知消息中心即可
    + 订阅者不关心谁是发布者，不关心发布者的状态，只用订阅消息中心即可

观察者模式更像是一种监督：嘿，观察者，你得盯着我，如果发现什么问题，帮我处理一下。
发布订阅模式则像一种广播体系：我们收听一些频道内容，而不去关心谁在维护这些频道内容。

目录：
<!-- MarkdownTOC -->

- [观察者模式](#%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)
    - [定义观察者和被观察者接口](#%E5%AE%9A%E4%B9%89%E8%A7%82%E5%AF%9F%E8%80%85%E5%92%8C%E8%A2%AB%E8%A7%82%E5%AF%9F%E8%80%85%E6%8E%A5%E5%8F%A3)
    - [构造被观察者](#%E6%9E%84%E9%80%A0%E8%A2%AB%E8%A7%82%E5%AF%9F%E8%80%85)
    - [构造观察者](#%E6%9E%84%E9%80%A0%E8%A7%82%E5%AF%9F%E8%80%85)
    - [测试与说明](#%E6%B5%8B%E8%AF%95%E4%B8%8E%E8%AF%B4%E6%98%8E)
- [发布订阅模式](#%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85%E6%A8%A1%E5%BC%8F)
    - [消息中心](#%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83)
    - [发布者和订阅者](#%E5%8F%91%E5%B8%83%E8%80%85%E5%92%8C%E8%AE%A2%E9%98%85%E8%80%85)
    - [测试与说明](#%E6%B5%8B%E8%AF%95%E4%B8%8E%E8%AF%B4%E6%98%8E-1)

<!-- /MarkdownTOC -->

<!-- more -->

<a name="%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F"></a>
## 观察者模式

<a name="%E5%AE%9A%E4%B9%89%E8%A7%82%E5%AF%9F%E8%80%85%E5%92%8C%E8%A2%AB%E8%A7%82%E5%AF%9F%E8%80%85%E6%8E%A5%E5%8F%A3"></a>
### 定义观察者和被观察者接口

```php
interface Observer
{
    function update(Observable $observee);
}

interface Observable
{
    function attach(Observer $observer);
    function detach(Observer $obesrver);
    function notify();
}
```

观察者接收被观察者并调用自身的update方法进行适当更新；被观察者利用attach注册观察者，detach解除某个注册，notify通知观察者进行更新。

<a name="%E6%9E%84%E9%80%A0%E8%A2%AB%E8%A7%82%E5%AF%9F%E8%80%85"></a>
### 构造被观察者

```php
class MyObservee implements Observable
{
    private $_observers = [];
    public $val = 0;

    function attach(Observer $observer)
    {
        $this->observers[] = $observer;
    }

    function detach(Observer $observer)
    {
        foreach ($this->_observers as $_index => $_observer) {
            if ($_observer === $observer) {
                unset($this->_observers[$_index]);
                $this->_observers = array_values($this->_observers);
                return;
            }
        }
    }

    function notify()
    {
        foreach ($this->_observers as $_observer) {
            $_observer->update($this);
        }
    }
}
```

注意notify方法中传递了$this。被观察者的val属性是为了测试使用，以便解释观察者是如何修改被观察者的状态的。

<a name="%E6%9E%84%E9%80%A0%E8%A7%82%E5%AF%9F%E8%80%85"></a>
### 构造观察者

```php
class MyObserver_1 implements Observer
{
    function update(Observable $observee)
    {
        $observee->val += 1;
    }
}

class MyObserver_2 implements Observer
{
    function update(Observable $observee)
    {
        $observee->val += 2;
    }
}
```

<a name="%E6%B5%8B%E8%AF%95%E4%B8%8E%E8%AF%B4%E6%98%8E"></a>
### 测试与说明

```php
$observee = new MyObservee();
$observer = new MyObserver_1();

$observee->attach($observer);
$observee->attach(new MyObserver_2());
$observee->notify();
echo $observee->val;    // 3

$observee->detach($observer);
$observee->notify();
echo $observee->val;    // 5
```

观察者模式中，观察者和被观察者存在一定的耦合，被观察者在请求观察者监控自己的同时，也赋予了观察者修改自身的能力。有时候这种副作用是我们想要的，比如设置一些flag，但同时也会为debug造成不便。

<a name="%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85%E6%A8%A1%E5%BC%8F"></a>
## 发布订阅模式

<a name="%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83"></a>
### 消息中心

```php
class MessageCenter
{
    // stores all the topic that can be subscribed
    private static $_topics = [];

    public static function publish($topic, $data = null)
    {
        if (isset(self::$_topics[$topic])) {
            foreach (self::$_topics[$topic] as $_subscriber) {
                call_user_func($_subscriber, $data);
            }
        }
    }

    public static function subscribe($topic, $callback)
    {
        if (!is_callable($callback)) {
            return false;
        }

        if (!isset(self::$_topics[$topic])) {
            self::$_topics[$topic] = [];
        }
        self::$_topics[$topic][] = $callback;
        return true;
    }

    public static function getAllTopics()
    {
        return array_keys(self::$_topics);
    }
}
```

消息中心将消息频道保存在topics静态数组中，同时开发以下三个接口：
- publish为发布者提供服务，供发布者发布消息，并允许发布者为消息附加解释数据
- subscribe为订阅者服务，供其订阅服务，并要求其注册回调，以在有新消息时可以通知订阅者
- getAllTopics获取当前存在的订阅服务

在publish时，发布者不需要关心订阅者状态，因此消息中心在有订阅者存在时通知订阅者，没有订阅者存在时直接忽略这条publish。

<a name="%E5%8F%91%E5%B8%83%E8%80%85%E5%92%8C%E8%AE%A2%E9%98%85%E8%80%85"></a>
### 发布者和订阅者

我们虚构一个发布者Hollywood和一个MovieFans。MovieFans很喜欢Hollywood，我们为他订阅了Hoolywood的一些推送。

```php
class Hollywood
{
    public function publishMovie()
    {
        $data = new \stdClass();
        $data->message = 'new movie comes!';
        MessageCenter::publish('Hollywood\movie', $data);
    }

    public function sayHelloToFans()
    {
        MessageCenter::publish('Hollywood\hello');
    }
}

class MovieFans
{
    public function __construct()
    {
        MessageCenter::subscribe('Hollywood\movie', [__CLASS__, 'checkMovie']);
        MessageCenter::subscribe('Hollywood\hello', [__CLASS__, 'feelHappy']);

    }

    public function checkMovie($data) {
        echo 'WOW. Hollywood relased a new movie and said: ' . $data->message . PHP_EOL;
    }

    public function feelHappy() {
        echo 'OH MY GOD ! ! ! Hollywood just said hello to me ! ! !' . PHP_EOL;
    }
}
```

<a name="%E6%B5%8B%E8%AF%95%E4%B8%8E%E8%AF%B4%E6%98%8E-1"></a>
### 测试与说明

```php
$hollywood = new Hollywood();
$movieFans = new movieFans();
$hollywood->publishMovie();
$hollywood->sayHelloToFans();
// echo: WOW. Hollywood relased a new movie and said: new movie comes!
// echo: OH MY GOD ! ! ! Hollywood just said hello to me ! ! !
```

Hollywood推送了一些消息，他的粉丝MovieFans订阅了这些服务，很开心能收到通知。

更进一步，Hollywood可能有很多部门都在向同一个频道发布更新，这时只要消息中心进行一定的权限认证，保证这些推送是正规有效的，那么我们的订阅者则可以获得Hollywood的推送服务，而不必关心这些推送来自哪个部门。

通过发布订阅模式，我们解除了发布者和订阅者之间的依赖，他们成为相互独立的对象。发布者专心做自己的事情，然后推送更新到消息中心；订阅者只需在消息中心订阅想要的服务，在其更新时便能收到消息中心的通知。