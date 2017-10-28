---
title: PHP单例模式
date: 2017-07-05
tag: [PHP, 设计模式]
---

>单例最重要的方面在于对创建示例的限制能力。如果不这样做，潜在的多个实例将被创建，因而造成严重破坏

如果在实例化时将类保存在全局变量，那么迟早会发生冲突。单例模式是一种对于全局变量的改进，可以保证全局只有一个单例类。

目录：
<!-- MarkdownTOC -->

- [一个简单的单例类](#%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E5%8D%95%E4%BE%8B%E7%B1%BB)
- [解决代码复用的问题](#%E8%A7%A3%E5%86%B3%E4%BB%A3%E7%A0%81%E5%A4%8D%E7%94%A8%E7%9A%84%E9%97%AE%E9%A2%98)
    - [使用Traits](#%E4%BD%BF%E7%94%A8traits)
    - [使用继承](#%E4%BD%BF%E7%94%A8%E7%BB%A7%E6%89%BF)
- [解决复用类的问题](#%E8%A7%A3%E5%86%B3%E5%A4%8D%E7%94%A8%E7%B1%BB%E7%9A%84%E9%97%AE%E9%A2%98)
- [对隐藏依赖的解释](#%E5%AF%B9%E9%9A%90%E8%97%8F%E4%BE%9D%E8%B5%96%E7%9A%84%E8%A7%A3%E9%87%8A)

<!-- /MarkdownTOC -->

<!-- more -->

<a name="%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E5%8D%95%E4%BE%8B%E7%B1%BB"></a>
## 一个简单的单例类

```php
class Singleton
{
    // This static variable stores this Singleton itself
    private static $_instance = null;

    // Make the constructor private to prevent `new` method to create Singleton
    private function __construct()
    {
        // do something here
    }

    // Prevent `clone` method to copy a Singleton
    private function __clone()
    {
    }

    // The only way to get this Singleton
    public static function getInstance()
    {
        if (!isset(self::$_instance)) {
            self::$_instance = new Singleton();
        }
        return self::$_instance;
    }
}

$test = Singleton::getInstance();
$test->val = 1;
$test2 = Singleton::getInstance();
echo $test2->val;   // 1
```

上面实现了最原始的单例类：
- 通过一个私有的静态变量保存自身
- 私有化构造函数和克隆函数，使该类仅能从该类自身内部创建
- 开放getInstance接口，在初次获取单例时创建单例并调用构造函数，之后始终返回该单例

但同时也产生了一些问题：
- 代码复用。两个单例类仅在构造时有较大差异时，是否只能拷贝代码？(比如连接两个不同的数据库)
- 重用类。当需要同一个类的两个单例时，似乎无能为力。(比如需要同一数据库的两个独立连接)
- 可能隐藏依赖。如果别的类中调用了单例类，这种依赖十分隐蔽。

<a name="%E8%A7%A3%E5%86%B3%E4%BB%A3%E7%A0%81%E5%A4%8D%E7%94%A8%E7%9A%84%E9%97%AE%E9%A2%98"></a>
## 解决代码复用的问题

两个类只在构造函数有所不同，其他方法和属性基本相似，此时有两种解决方法：
- 使用Traits
- 继承

<a name="%E4%BD%BF%E7%94%A8traits"></a>
### 使用Traits

Tarits的最基本形式被认为是一种辅助编译器的复制粘贴技术。

```php
trait Singleton
{
    // This static variable stores this Singleton itself
    private static $_instance = null;

    // Prevent `clone` method to copy a Singleton
    private function __clone()
    {
    }

    // The only way to get this Singleton
    public static function getInstance()
    {
        if (!isset(self::$_instance)) {
            $class = __CLASS__;
            self::$_instance = new $class();
        }
        return self::$_instance;
    }

    // Some common methods goes here
}

class Singleton_1
{
    use Singleton;

    // Make the constructor private to prevent `new` method to create Singleton
    private function __construct()
    {
        // do something here
    }
}

class Singleton_2
{
    use Singleton;

    // Make the constructor private to prevent `new` method to create Singleton
    private function __construct()
    {
        // do aother thing here
    }
}
```

Traits通过动态检测调用getInstance方法时的类，区分两个单例类，调用他们不同的构造方法，但同时又可以在trait结构体中实现相同的属性和方法。

但是这种实现无法解决重用类的问题，如果需要两个Singleton_1的实例，Traits将束手无策。

<a name="%E4%BD%BF%E7%94%A8%E7%BB%A7%E6%89%BF"></a>
### 使用继承

```php
abstract class SingletonClass
{
    /**
     * @var array [instanceNeedle => instance]
     * instanceNeedle equals "className".
     */
    private static $_instanceMap;

    // Make the constructor protected either to prevent `new` method or to grant access to its implementer
    final protected function __construct()
    {
    }

    // Either to prevent `clone` method or to grant access to its implementer
    final protected function __clone()
    {
    }

    // The only way to get a Singleton
    public function getInstance()
    {
        $class = get_called_class();

        if (!isset(self::$_instanceMap[$instanceNeedle])) {
            self::$_instanceMap[$instanceNeedle] = new $class();
        }
        return self::$_instanceMap[$instanceNeedle];
    }
}

class Singleton_1 extends SingletonClass
{
    public $val = 0;
}

class Singleton_2 extends SingletonClass
{
    public $val = 0;
}

$test1 = Singleton_1::getInstance();
$test2 = Singleton_2::getInstance();
$test1->val = 1;
$test2->val = 2;
echo $test1->val . $test2->val;   // 12
```

通过继承实现有以下要点：
- 通过一个私有的静态数组保存单例类的映射
- 受保护的构造函数和克隆函数，使该类可以从抽象类创建而不能从外部环境创建
- 开放getInstance接口，初次获取某一单例时创建单例并调用构造函数，然后将其保存至数组中供将来使用

接下来我们可以扩展该抽象，使其可以复用类

<a name="%E8%A7%A3%E5%86%B3%E5%A4%8D%E7%94%A8%E7%B1%BB%E7%9A%84%E9%97%AE%E9%A2%98"></a>
## 解决复用类的问题

```php
abstract class SingletonClass
{
    /**
     * @var array [instanceNeedle => instance]
     * instanceNeedle equals "className" (default) or "className/instanceNeedle" (specified instanceNeedle).
     * all instanceNeedle will be saved in lower case, so it's case insensitive.
     */
    private static $_instanceMap;

    // Make the constructor protected either to prevent `new` method or to grant access to its implementer
    final protected function __construct()
    {
    }

    // Either to prevent `clone` method or to grant access to its implementer
    final protected function __clone()
    {
    }

    // Grant its implementer a power to init itself
    protected function init()
    {
    }

    // The only way to get a Singleton
    public function getInstance($instanceNeedle = '')
    {
        $class = get_called_class();
        $instanceNeedle = empty($instanceNeedle) ? $class : $class . '/' . $instanceNeedle;
        $instanceNeedle = strtolower($instanceNeedle);

        if (!isset(self::$_instanceMap[$instanceNeedle])) {
            self::$_instanceMap[$instanceNeedle] = new $class();
            self::$_instanceMap[$instanceNeedle]->init();
        }
        return self::$_instanceMap[$instanceNeedle];
    }
}

class Singleton_1 extends SingletonClass
{
    public $val = 0;
}

class Singleton_2 extends SingletonClass
{
    public $val = 0;
}

$test1 = Singleton_1::getInstance();
$test2 = Singleton_2::getInstance();
$test3 = Singleton_2::getInstance('test2');
$test1->val = 1;
$test2->val = 2;
$test3->val = 3;
echo $test1->val . $test2->val . $test3->val;   // 123 
```

较之前的实现，该类在以下几处做了扩展：
- 通过init方法，赋予子类初始化的能力
- 可选的Needle，在指明Needle时，返回对应的单例，实现了复用类的能力


<a name="%E5%AF%B9%E9%9A%90%E8%97%8F%E4%BE%9D%E8%B5%96%E7%9A%84%E8%A7%A3%E9%87%8A"></a>
## 对隐藏依赖的解释

现代化的PHP应用采用autoload方法加载类，这对单例类来说似乎非常友好。

```php
namespace \namespace\to\this\class

use \class1\in\some\namespace;
use \class22\in\some\namespace;
use \Singleton\in\some\namespace;
use \class99\in\some\namespace;

class SomeClass
{
    public val1;
    public val2;
    public val99;

    function func1()
    {
    }

    function func2()
    {
        // some code goes here
        $var = Singleton::getInstance();
        $var->doSomeThing();
        // some other code
    }

    function func99()
    {
    }
}
```

这个类文件中包含了命名空间声明，使用该类时，PHP会自动加载单例类的依赖，但这并不意味着不存在依赖。

设想这么一种情况：
- 单例类S用来保存数据库连接
- 类A会为S注册数据库连接
- 类B会利用S操作数据库

如果A的实现者忘记了为S注册数据库连接，那么B操作数据库失败时，就只能去单例类S找原因，而真正的原因则藏在A中，可怜的B甚至不知道A的存在。
