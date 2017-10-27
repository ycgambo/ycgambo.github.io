
---

title: php 观察者模式+工厂模式 组合应用
date: 2017-07-02
tag: [php]

---

工厂模式把类的创建者和创建的类分离开来，负责产生正确的被观察对象，然后控制器将观察者绑定在需要被观察的对象上。

采用这种组合的好处是类间的关系十分松散，可以灵活应对需求的变更：

- 需求功能的增减（如增加某个日志、增加某些监管）
- 需求类型的增减（如扩展某种类、新增一些类）
- 按照接口编程，控制器需要改动的代码很少

下面用request类（被创建的类、被观察对象）和一些辅助类（观察者、工厂管理者、工厂）做说明。

<!-- MarkdownTOC -->

- [定义抽象request类型](#定义抽象request类型)
- [定义观察者和被观察者类型](#定义观察者和被观察者类型)
- [扩展request为http类型](#扩展request为http类型)
- [构造观察者](#构造观察者)
- [定义工厂管理者](#定义工厂管理者)
- [定义工厂接口](#定义工厂接口)
- [构造request工厂管理者](#构造request工厂管理者)
- [构造Request_http工厂](#构造requesthttp工厂)
- [控制器](#控制器)

<!-- /MarkdownTOC -->

<a name="定义抽象request类型"></a>
## 定义抽象request类型

request可能来自http，也可能来自app或者其他请求，采用`$_type`标明。

所有的request实体均需继承自该类。

```php
abstract class Request
{
    protected $_type;
    
    public function getType()
    {
        return $this->_type;
    }
}
```

<a name="定义观察者和被观察者类型"></a>
## 定义观察者和被观察者类型

被观察者接口：

```php
interface IObservable
{
    public function attach(IObserver $observer);
    public function detach(IObserver $observer);
    public function notify();
}
```

attach用于绑定观察者，detach用于解绑，notify用于触发观察者。

观察者接口：

```php
interface IObserver
{
    public function update(IObservable $observable);
}
```

update用于观察者实现自身的行为，或者更新被观察者的状态。

<a name="扩展request为http类型"></a>
## 扩展request为http类型

继承Request对象，并实现被观察者接口。

其实也可以将上面的IObservable接口定义为抽象类，以减少attach、detach以及notify这部分代码的重复。

请注意notify方法，该方法依次调用观察者的update方法，并 **传递被观察者本身** 作为参数，这也是观察者模式最重要的一点。

```php
class Request_http extends Request implements IObservable
{
    private $_observers;
    
    public function __construct()
    {
        $this->_type = 'http';
        $this->_observers = array();
    }

    public function attach(IObserver $observer)
    {
        if (!in_array($observer, $this->_observers)) {
            $this->_observers[] = $observer;
        }
    }
    public function detach(IObserver $observer)
    {
        if (in_array($observer, $this->_observers)) {
            $newobservers = array();
            foreach ($this->_observers as $obs) {
                if ($obs !== $observer) {
                    $newobservers[] = $obs;
                }
            }
            $this->_observers = $newobservers;
        }
        
    }
    public function notify()
    {
        foreach ($this->_observers as $obs) {
            $obs->update($this);
        }
    }
}
```

<a name="构造观察者"></a>
## 构造观察者

构造一个简单的安全处理模块。

```php
class RequestSecurityObserver implements IObserver
{
    public function update(IObservable $observable)
    {
        // security handler
        // do some check here
    }
}
```

至此，我们已经实现了一个Request_http类，作为被观察对象。以及一个RequestSecurityObserver类，作为观察者。

下面实现工厂模式，构造Request_http类，并返回该类给控制器。

<a name="定义工厂管理者"></a>
## 定义工厂管理者

为了方便对不同request的特殊处理，应该为每一个类构造对应的工厂，因此需要一个管理者来操作正确的工厂。

每组类型的工厂都可能需要一个管理者（如request、database、view），因此只需抽象的定义一个getObject方法即可。

```php
interface IGeneraterManager
{
    public function getObject();
}
```

<a name="定义工厂接口"></a>
## 定义工厂接口

工厂方法也只定义了一个generate方法，用于生成该工厂对应的类。

```php
interface IGenerater
{
    public function generate();
}
```

<a name="构造request工厂管理者"></a>
## 构造request工厂管理者

`IGeneraterManager`忽视了各类工厂管理者的具体职能，此处需要赋予request工厂管理者 **特定** 的职能。

这里只简要地加以说明。

该工厂管理者的构造函数引入了Request抽象类，强制所有的工厂返回Request类型，这属于它的特定职能。

```php
class RequestGeneraterManager implements IGeneraterManager
{
    private $_type;
    private $_generater;

    public function __construct()
    {
        $this->_determineType();
        $this->_determineGenerater();
        
        include_once 'Request.abstract.php';
    }

    public function getObject()
    {
        return $this->_generater->generate();
    }

    private function _determineType()
    {
        // should do some check to determine request type
        // but for clear, we just name a type for this here
        $this->_type = 'http';
    }
    private function _determineGenerater()
    {
        switch ($this->_type) {
            case 'http':
                include_once 'RequestGenerater_http.class.php';
                $this->_generater = new RequestGenerater_http();
        }
    }
}
```

<a name="构造requesthttp工厂"></a>
## 构造Request_http工厂

这个工厂返回Request_http类型，它还有权决定返回哪种Request_http类型，可能是Request_http_mobile以适应移动终端，也可能是Request_http_pc以适应桌面端。

为了简单起见，这里只返回最基本的Request_http类型。

```php
class RequestGenerater_http implements IGenerater
{
    public function generate()
    {
        include_once 'Request_http.class.php';
        return new Request_http();
    }
}
```

至此，所有的类已经构造完毕。接下来是控制器的控制流。

<a name="控制器"></a>
## 控制器

首先在控制器中引入 *工厂管理者* 和各种 *观察者*。

然后调用管理者的`getObject`方法获得正确的Request类，它同时也是被观察对象。

接着将各种观察者绑定到Request上，或者解绑。

最后通知观察者即可。

```php
include_once ROOT.'/models/datatype/request/RequestGeneraterManager.class.php';
include_once ROOT.'/models/datatype/request/RequestSecurityObserver.class.php';
include_once ROOT.'/models/datatype/request/RequestxxxxxxxxObserver.class.php';
include_once ROOT.'/models/datatype/request/RequestxxxxxxxxObserver.class.php';
$request_generater_manager = new RequestGeneraterManager();
$request = $request_generater_manager->getObject();
$request->attach(new RequestSecurityObserver());
$request->attach(new RequestxxxxxxxxObserver());
$request->detach(new RequestxxxxxxxxObserver());
$request->notify();
```

通过以上一系列的定义，Request类已经非常灵活，后期无论是新增功能（新建观察者），还是新增类型（新建工厂），都可以轻松应付。

新增功能时，只要改动控制器的attach和detach即可。
新增类型时，只要新建该类型，在工厂中做与其对应的处理即可。

下面是程序流：

1. 控制器实例化工厂管理者RequestGeneraterManager
2. 控制器调用管理者的getObject方法获得Request对象
    1. 工厂管理者调用适当工厂的generate方法
    2. 工厂生成相应对象，并赋予其合适的属性
3. 控制器为Request对象绑定各种观察者
4. 控制器调用Request的notify方法，使观察者依次操作Request对象
5. 控制器重新拥有Request对象的控制权