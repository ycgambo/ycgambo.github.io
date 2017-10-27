
---

title: php 单例模式
date: 2017-07-05
tag: [php]

---

> 全局变量将类捆绑于特定的环境，破坏了封装。

换句话说，一旦类开始依赖于全局变量，那么某些类中声明的全局变量迟早会和其他地方声明的全局变量发生冲突。

单例模式是一种对于全局变量的改进，可以保证全局只有一个单例类，但同时可能会引入依赖关系。这种依赖关系不是指类的方法调用时引用的参数，而是指类的方法内部实现引用了单例类，而且这种依赖关系难以追踪（下面会用例子解释）。

单例模式有利有弊，适度使用可以改进系统设计，避免传递各种不必要的对象；但过度使用会使程序变得混乱，难以追踪调试。

## Database单例类

下面这段程序是从php manual中的一个评论中找到的。

`DB_DSN, DB_USER, DB_PASS`这三个变量是全局变量，应该在其他位置（如配置文件configure.php)中定义。

私有静态变量`$_instance`用于保存Database的实例，只能通过getInstance方法获取该实例。

把构造函数定义为`private`以阻止new操作生成对象。

把克隆函数定义为`private`以阻止clone操作复制对象。

把静态调用方法定义为`final, public`以传递PDO操作。

```php
class Database
{
    private static $_instance;
    /*
     * Class Constructor - Create a new database connection if one doesn't exist
     * Set to private so no-one can create a new instance via ' = new DB();'
     */
    private function __construct() {}
    /*
     * Like the constructor, we make __clone private so nobody can clone the instance
     */
    private function __clone() {}
    /*
     * Returns DB instance or create initial connection
     * @param
     * @return $_instance;
     */
    public static function getInstance()
    {
        if(!self::$_instance){
            self::$_instance = new PDO(DB_DSN, DB_USER, DB_PASS);
            self::$_instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$_instance;
    }
    /*
     * Passes on any static calls to this class onto the singleton PDO instance
     * @param $chrMethod, $arrArguments
     * @return $mix
     */
    final public static function __callStatic($chrMethod, $arrArguments)
    {
        if ($_instance == null) $_instance = self::getInstance();
        return call_user_func_array(array($_instance, $chrMethod), $arrArguments);
    }
}
```

在需要PDO连接的时候，用getInstance方法获取Database实例即可。

## DatabaseRebuild类

这个类的作用是重建数据库，接下来用这个类来说明单例类中的依赖关系。

```php
class DatabaseRebuild
{
    private static $_instance;
    private $_table_rebuild = array();
    private $_table_field = array(
        'video' =>
            'id                 INT NOT NULL AUTO_INCREMENT,
            name                VARCHAR(16) NOT NULL,
            path                VARCHAR(48) NOT NULL,
            PRIMARY KEY (id)',
    );
    public function __construct()
    {
        self::$_instance = Database::getInstance();
    }
    public function add($table = '')
    {
        if ($table !=  '') {
            $this->_table_rebuild[] = $table;
        }
    }
    public function execute()
    {
        foreach ($this->_table_rebuild as $table) {
            if(in_array($table, $this->_table_rebuild)){
                $sql = "DROP TABLE IF EXISTS $table";
                $res = self::$_instance->exec($sql);
                $sql = "CREATE TABLE $table (" . $this->_table_field[$table] . ") ENGINE=InnoDB DEFAULT CHARSET=utf8";
                $res = self::$_instance->exec($sql);
            } else {
                echo 'Error: failed to build '.$table;
            }
        }
    }
}
```

这个类在构造函数中引入了单例类Database以获取数据库连接，并将其保存在私有变量`$_instance`中。

对外界来说，`$_instance`并不可见，如果使用者不是类的作者，对其中的依赖关系可能并不知晓。

在数据库操作中，包含数据库连接文件是常识。但如果在其他一些使用环境中，由于使用者不知道这个依赖，没有包含单例类的文件，而只包含了所需的类，而该类又与单例类存在依赖关系，程序就会报错。

特别是在一些复杂的类中，单例类可能没有保存在类头部的变量声明区域，而是在方法内部引入，将使程序调试的难度大大增加。

举例如下：

```php
class SomeClass
{
    // some parameter define

    // a lot of method
    public function someMethod()
    {
        // do something
        $UnknownInstanceName = UnknownSingletonClass::UnknownGetInstanceMethod();
        // use $UnknownInstanceName to do something else
    }
    // a lot of method
}
```

上面的例子可能有一些极端，但站在类使用者的角度，这种情况不是不可能发生（如果类编写者的编码不太规范）。

因此，作为类编写者，单例模式使用前要仔细斟酌，写好文档，一定不可过度使用。