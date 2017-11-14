---
title: PHP 细数自动加载
date: 2017/11/14 00:11:51
categories: PHP
tags:
    - PHP
    - Syntax
---

autoload将我们从require的痛苦中解救出来，但是简单的autoload是如何一步步构建起庞大的应用的呢？Composer作为PHP的一款优秀的依赖管理工具，又是如何进行自动加载的呢？本文以YII2下的Composer为例，解析Composer源码，一起看看Composer的autoload艺术。

目录：
<!-- MarkdownTOC -->

- [__autoload](#autoload)
- [spl_autoload_register](#splautoloadregister)
- [Composer的自动加载](#composer%E7%9A%84%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD)
    - [classMap映射](#classmap%E6%98%A0%E5%B0%84)
    - [psr-0 和 psr-4](#psr-0-%E5%92%8C-psr-4)
    - [static类型](#static%E7%B1%BB%E5%9E%8B)
    - [files类型自动加载文件](#files%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%96%87%E4%BB%B6)

<!-- /MarkdownTOC -->

<!-- more -->

> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>

<a name="autoload"></a>
## __autoload

在很多PHP教材中，都采用[__autoload函数](http://php.net/manual/zh/function.autoload.php)讲解类的自动加载，举例如下：

在`test.php`文件中定义`Test`类，该类在初始化时会输出一句话：

```php
/**
 * test.php
 */

class Test {
    public function __construct() {
        echo 'hi, there' . PHP_EOL;
    }
}
```

在`index.php`文件中定义`__autoload`函数，在当前目录下搜索类的同名文件，然后包含该文件。

```php
/**
 * index.php
 */

function __autoload($className) {
    $fileName = './' . strtolower($className) . '.php';
    include_once($fileName);
}

$test = new Test();
```

运行`index.php`文件，可以看到输出：

```
$ php -f index.php
hi, there
```

但是，**__autoload函数在PHP 7.2.0中已经不赞成使用。**

使用该方法的缺点是：**`__autoload`只可以定义一次**。假如A的项目引用了B的代码，A和B采用两种`__autoload`，就会产生冲突，尤其是使用了很多插件的时候，合并`__autoload`会很麻烦。

<a name="splautoloadregister"></a>
## spl_autoload_register

> 如果需要多条 autoload 函数，[spl_autoload_register()](http://php.net/manual/zh/function.spl-autoload-register.php) 满足了此类需求。 它实际上创建了 autoload 函数的队列，按定义时的顺序逐个执行。相比之下， __autoload() 只可以定义一次。

在之前的基础上，新增一个文件`test2.class.php`：

```php
/**
 * index2.class.php
 */

class Test2 {
    public function __construct() {
        echo 'hi, there, too' . PHP_EOL;
    }
}
```

修改`index.php`文件，为`test2.class.php`建立加载函数：

```php
/**
 * index.php
 */

function autoloader_1($className) {
    $fileName = './' . strtolower($className) . '.php';
    include_once($fileName);
}

function autoloader_2($className) {
    $fileName = './' . strtolower($className) . '.class.php';
    include_once($fileName);
}

spl_autoload_register('autoloader_1');
spl_autoload_register('autoloader_2');

$test = new Test();
$test2 = new Test2();
```

运行`index.php`文件，有如下输出：

```
$ php -f index.php
hi, there
PHP Warning:  include_once(./test2.php): failed to open stream: No such file or directory in /Users/ycgambo/Documents/test/php/index.php on line 9
PHP Stack trace:
PHP   1. {main}() /Users/ycgambo/Documents/test/php/index.php:0
PHP   2. spl_autoload_call() /Users/ycgambo/Documents/test/php/index.php:21
PHP   3. autoloader_1() /Users/ycgambo/Documents/test/php/index.php:0
PHP Warning:  include_once(): Failed opening './test2.php' for inclusion (include_path='.:') in /Users/ycgambo/Documents/test/php/index.php on line 9
PHP Stack trace:
PHP   1. {main}() /Users/ycgambo/Documents/test/php/index.php:0
PHP   2. spl_autoload_call() /Users/ycgambo/Documents/test/php/index.php:21
PHP   3. autoloader_1() /Users/ycgambo/Documents/test/php/index.php:0
hi, there, too
```

通过第一行和最后一行的输出可知，PHP如期加载了两个类文件。在加载`Test2`类时，PHP按照加载函数注册的顺序，优先尝试搜索`test2.php`，但没有找到，所以报了`Warning`。

<a name="composer%E7%9A%84%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD"></a>
## Composer的自动加载


Composer作为PHP优秀的依赖管理工具，它的身影出现在许多著名框架中，因此有必要学习一下Composer是如何实现自动加载的。

`ComposerAutoloaderInit`是Composer的入口文件，主要保存了一个`ClassLoader`实例用来协助加载依赖：

```php
class ComposerAutoloaderInit
{
    private static $loader;
}
```

该`ClassLoader`实例会在一开始就被初始化，然后注册`autoload`：

```php
class ComposerAutoloaderInit
{
    public static function getLoader()
    {
        // ...
        $loader->register(true);
        // ...
    }
}
```

`register`方法向`spl_autoload_register`函数注册了自身的`loadClass`：

```php
class ClassLoader
{
    public function register($prepend = false)
    {
        spl_autoload_register(array($this, 'loadClass'), true, $prepend);
    }
}
```

`loadClass`方法用来加载文件。该方法先调用`findFile`方法寻找文件，再调用`includeFile`函数加载文件：

```php
class ClassLoader
{
    public function loadClass($class)
    {
        if ($file = $this->findFile($class)) {
            includeFile($file);

            return true;
        }
    }

    public function findFile($class)
    {
        // ... 按照类名返回合适的文件名，具体代码下面会讲
        
        return $file;
    }
}

// 隔离文件，防止加载的文件访问$this/self
function includeFile($file)
{
    include $file;
}
```

了解了加载流程（如何注册`spl_autoload_register`），接下来了解一下这些类文件是如何保存以及被加载的（`spl_autoload_register`的加载机制）。

<a name="classmap%E6%98%A0%E5%B0%84"></a>
### classMap映射

classMap类型是一个数组，它保存了类名到文件名的映射，这份映射关系保存在`autoload_classmap.php`文件中，格式如下：

```php
// $vendorDir = 'someDir';
return array(
    'File_Iterator' => $vendorDir . '/phpunit/php-file-iterator/src/Iterator.php',
    // ...
);
```

`ComposerAutoloaderInit`在注册`ClassLoader`时，会读取`autoload_classmap.php`文件，`ClassLoader`将映射保存在自己的`classMap`中：

```php
class ComposerAutoloaderInit
{
    public static function getLoader()
    {
        // ...
        $classMap = require __DIR__ . '/autoload_classmap.php';
        if ($classMap) {
            $loader->addClassMap($classMap);
        }
        // ...
    }
}
```

`ClassLoader`在加载时，会首先在这份映射中搜索：

```php
class ClassLoader
{
    public function findFile($class)
    {
        if (isset($this->classMap[$class])) {
            return $this->classMap[$class];
        }

        // ...
    }
}
```

<a name="psr-0-%E5%92%8C-psr-4"></a>
### psr-0 和 psr-4

其实，`ClassLoader`的`classMap`中不止保存了`classMap`类型的映射，还保存了适合`psr-0`和`psr-4`两种自动加载规范的映射：

```php
class ComposerAutoloaderInit
{
    public static function getLoader()
    {
        // ...
        $map = require __DIR__ . '/autoload_namespaces.php';
        foreach ($map as $namespace => $path) {
            $loader->set($namespace, $path);
        }

        $map = require __DIR__ . '/autoload_psr4.php';
        foreach ($map as $namespace => $path) {
            $loader->setPsr4($namespace, $path);
        }

        $classMap = require __DIR__ . '/autoload_classmap.php';
        if ($classMap) {
            $loader->addClassMap($classMap);
        }
        // ...
    }
}
```

与`classMap`不同的是，这两种规范定义的是命名空间的映射，可以将一个命名空间映射到一个目录，`spl_autoload_register`函数在解析命名空间下符合规范要求的类名时，可以自动解析到目录下对应的文件，因此可以不必为每一个类都指定对应的文件名。

`classMap`类型的映射，每一个类都映射到文件，繁琐的对应关系，但也比较直接：
![classMap类型](/images/PHP/syntax_autoloadCountOff/composer_classmap.png)

`psr-4`类型的映射（`psr-0`与之类似），点到为止，十分简洁，但需要遵循规范：
![psr-4类型](/images/PHP/syntax_autoloadCountOff/composer_psr4.png)

<a name="static%E7%B1%BB%E5%9E%8B"></a>
### static类型

先上代码，看一看static类型是在哪里引入的：

```php
class ComposerAutoloaderInit
{
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        spl_autoload_register(array('ComposerAutoloaderInit', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader();
        spl_autoload_unregister(array('ComposerAutoloaderInit', 'loadClassLoader'));

        $useStaticLoader = PHP_VERSION_ID >= 50600 && !defined('HHVM_VERSION') && (!function_exists('zend_loader_file_encoded') || !zend_loader_file_encoded());
        if ($useStaticLoader) {
            require_once __DIR__ . '/autoload_static.php';

            call_user_func(\Composer\Autoload\ComposerStaticInit::getInitializer($loader));
        } else {
            $map = require __DIR__ . '/autoload_namespaces.php';
            foreach ($map as $namespace => $path) {
                $loader->set($namespace, $path);
            }

            $map = require __DIR__ . '/autoload_psr4.php';
            foreach ($map as $namespace => $path) {
                $loader->setPsr4($namespace, $path);
            }

            $classMap = require __DIR__ . '/autoload_classmap.php';
            if ($classMap) {
                $loader->addClassMap($classMap);
            }
        }
        // ...
    }
}
```

static静态类型和上面几种类型用`if-else`结构隔开，目的很明显，要么用`if`加载，要么用`else`加载，为什么要这么做呢？

原来，如果php的版本大于5.6 ,composer会进行加载优化，减少大量映射的加载时间：

> Optimized the autoloader initialization using static loading on PHP 5.6 and above, this reduces the load time for large classmaps to almost nothing

不同于上面简单定义的数组，`autoload_static.php`文件定义的是一个`ComposerStaticInit`类:

```php
namespace Composer\Autoload;

class ComposerStaticInit
{
    public static $files = array (
        // ...
    );

    public static $prefixLengthsPsr4 = array (
        // ...
    );

    public static $prefixDirsPsr4 = array (
        // ...
    );

    public static $prefixesPsr0 = array (
        // ...
    );

    public static $classMap = array (
        // ...
    );

    public static function getInitializer(ClassLoader $loader)
    {
        // ...
    }
}
```

`ComposerStaticInit`类保存了上面各种类型的映射的静态副本，此外还定义了一个初始化方法`getInitializer`。前面`ComposerAutoloaderInit`调用这个方法时，传入了一个`ClassLoader`：

    call_user_func(\Composer\Autoload\ComposerStaticInit::getInitializer($loader));

之后再在`getInitializer`方法中巧妙利用`Closure::bind`操作访问`ClassLoader`的私有变量，达到静态加载的目的：

```php
class ComposerStaticInit
{
    // ...
    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInit::$prefixesPsr0;
            $loader->classMap = ComposerStaticInit::$classMap;

        }, null, ClassLoader::class);
    }
}

// 这些变量在ClassLoader定义如下
class ClassLoader
{
    // PSR-4
    private $prefixLengthsPsr4 = array();
    private $prefixDirsPsr4 = array();

    // PSR-0
    private $prefixesPsr0 = array();

    private $classMap = array();
}
```

<a name="files%E7%B1%BB%E5%9E%8B%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%96%87%E4%BB%B6"></a>
### files类型自动加载文件

上面的几种类型都属于类的自动加载，files类型则是在`ClassLoader`注册好`loadClass`后就立即包含进所指定的文件：

```php
class ComposerAutoloaderInit
{
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        spl_autoload_register(array('ComposerAutoloaderInit', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader();
        spl_autoload_unregister(array('ComposerAutoloaderInit', 'loadClassLoader'));

        $useStaticLoader = PHP_VERSION_ID >= 50600 && !defined('HHVM_VERSION') && (!function_exists('zend_loader_file_encoded') || !zend_loader_file_encoded());
        if ($useStaticLoader) {
            require_once __DIR__ . '/autoload_static.php';

            call_user_func(\Composer\Autoload\ComposerStaticInit::getInitializer($loader));
        } else {
            $map = require __DIR__ . '/autoload_namespaces.php';
            foreach ($map as $namespace => $path) {
                $loader->set($namespace, $path);
            }

            $map = require __DIR__ . '/autoload_psr4.php';
            foreach ($map as $namespace => $path) {
                $loader->setPsr4($namespace, $path);
            }

            $classMap = require __DIR__ . '/autoload_classmap.php';
            if ($classMap) {
                $loader->addClassMap($classMap);
            }
        }

        $loader->register(true);

        if ($useStaticLoader) {
            $includeFiles = Composer\Autoload\ComposerStaticInit::$files;
        } else {
            $includeFiles = require __DIR__ . '/autoload_files.php';
        }
        foreach ($includeFiles as $fileIdentifier => $file) {
            composerRequire($fileIdentifier, $file);
        }

        return $loader;
    }
}
```

上面已经是完整的`getLoader`方法了。

`autoload_files.php`文件格式如下：

```php
// $vendorDir = 'someDir';
return array(
    '0e6d7bf4a5811bfa5cf40c5ccd6fae6a' => $vendorDir . '/symfony/polyfill-mbstring/bootstrap.php',
    '2cffec82183ee1cea088009cef9a6fc3' => $vendorDir . '/ezyang/htmlpurifier/library/HTMLPurifier.composer.php',
    // ...
);
```

至此，composer的自动加载已经基本介绍完毕。需要指出的是，`ComposerAutoloaderInit`和`ComposerStaticInit`其实是有SHA值的，我的如下：`ComposerAutoloaderInit863a9fe54c36c8e7444b35fbf849f660`、`ComposerStaticInit863a9fe54c36c8e7444b35fbf849f660`，文中为了方便将其删除。