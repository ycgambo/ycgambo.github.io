
---

title: php 反射API
date: 2017-07-07
tag: [php]

---

> 反射 API，添加了对类、接口、函数、方法和扩展进行**反向**工程的能力。

反射API是可以分析属性、方法和类的一系列内置类。

var_dump()函数虽然可以检查类，但它必须在类**实例化之后**才可使用，它虽可以看到方法名，却不能使代码从中动态获取方法名。

反射API不仅可以用于检查类，还可以在**运行时**访问对象、函数和脚本中的各种详细信息。

各种反射API的详细资料可以在[PHP:反射 - Manual](http://php.net/manual/zh/book.reflection.php)中找到。

<!-- MarkdownTOC -->

- [Reflection](#reflection)
- [Reflector](#reflector)
    - [ReflectionObject](#reflectionobject)
    - [ReflectionFunctionAbstract](#reflectionfunctionabstract)
        - [ReflectionFunction](#reflectionfunction)
    - [ReflectionClass](#reflectionclass)
        - [ReflectionProperty](#reflectionproperty)
        - [ReflectionMethod](#reflectionmethod)
    - [ReflectionParameter](#reflectionparameter)
    - [ReflectionType](#reflectiontype)

<!-- /MarkdownTOC -->

<a name="reflection"></a>
## Reflection

定义了reflection类

```php
Reflection {
    /* Methods */
    public static string export ( Reflector $reflector [, bool $return = false ] )
    public static array getModifierNames ( int $modifiers )
}
```

<a name="reflector"></a>
## Reflector

所有的Reflection类都需实现这一接口

```php
Reflector {
    /* Methods */
    public static string export ( void )
    public string __toString ( void )
}
```

<a name="reflectionobject"></a>
### ReflectionObject

报告一个对象的相关信息

```php
ReflectionObject extends ReflectionClass implements Reflector {
    /* Constants */
    const integer IS_IMPLICIT_ABSTRACT = 16 ;
    const integer IS_EXPLICIT_ABSTRACT = 32 ;
    const integer IS_FINAL = 64 ;
    /* Properties */
    public $name ;
    /* Methods */
    public __construct ( object $argument )
    public static string export ( string $argument [, bool $return ] )
    /* Inherited methods */
    public ReflectionClass::__construct ( mixed $argument )
    public static string ReflectionClass::export ( mixed $argument [, bool $return = false ] )
    public mixed ReflectionClass::getConstant ( string $name )
    public array ReflectionClass::getConstants ( void )
    public ReflectionMethod ReflectionClass::getConstructor ( void )
    public array ReflectionClass::getDefaultProperties ( void )
    public string ReflectionClass::getDocComment ( void )
    public int ReflectionClass::getEndLine ( void )
    public ReflectionExtension ReflectionClass::getExtension ( void )
    public string ReflectionClass::getExtensionName ( void )
    public string ReflectionClass::getFileName ( void )
    public array ReflectionClass::getInterfaceNames ( void )
    public array ReflectionClass::getInterfaces ( void )
    public ReflectionMethod ReflectionClass::getMethod ( string $name )
    public array ReflectionClass::getMethods ([ int $filter ] )
    public int ReflectionClass::getModifiers ( void )
    public string ReflectionClass::getName ( void )
    public string ReflectionClass::getNamespaceName ( void )
    public ReflectionClass ReflectionClass::getParentClass ( void )
    public array ReflectionClass::getProperties ([ int $filter ] )
    public ReflectionProperty ReflectionClass::getProperty ( string $name )
    public string ReflectionClass::getShortName ( void )
    public int ReflectionClass::getStartLine ( void )
    public array ReflectionClass::getStaticProperties ( void )
    public mixed ReflectionClass::getStaticPropertyValue ( string $name [, mixed &$def_value ] )
    public array ReflectionClass::getTraitAliases ( void )
    public array ReflectionClass::getTraitNames ( void )
    public array ReflectionClass::getTraits ( void )
    public bool ReflectionClass::hasConstant ( string $name )
    public bool ReflectionClass::hasMethod ( string $name )
    public bool ReflectionClass::hasProperty ( string $name )
    public bool ReflectionClass::implementsInterface ( string $interface )
    public bool ReflectionClass::inNamespace ( void )
    public bool ReflectionClass::isAbstract ( void )
    public bool ReflectionClass::isAnonymous ( void )
    public bool ReflectionClass::isCloneable ( void )
    public bool ReflectionClass::isFinal ( void )
    public bool ReflectionClass::isInstance ( object $object )
    public bool ReflectionClass::isInstantiable ( void )
    public bool ReflectionClass::isInterface ( void )
    public bool ReflectionClass::isInternal ( void )
    public bool ReflectionClass::isIterateable ( void )
    public bool ReflectionClass::isSubclassOf ( string $class )
    public bool ReflectionClass::isTrait ( void )
    public bool ReflectionClass::isUserDefined ( void )
    public object ReflectionClass::newInstance ( mixed $args [, mixed $... ] )
    public object ReflectionClass::newInstanceArgs ([ array $args ] )
    public object ReflectionClass::newInstanceWithoutConstructor ( void )
    public void ReflectionClass::setStaticPropertyValue ( string $name , string $value )
    public string ReflectionClass::__toString ( void )
}
```

<a name="reflectionfunctionabstract"></a>
### ReflectionFunctionAbstract

ReflectionFunction的父类

```php
ReflectionFunctionAbstract implements Reflector {
    /* Properties */
    public $name ;
    /* Methods */
    final private void __clone ( void )
    public ReflectionClass getClosureScopeClass ( void )
    public object getClosureThis ( void )
    public string getDocComment ( void )
    public int getEndLine ( void )
    public ReflectionExtension getExtension ( void )
    public string getExtensionName ( void )
    public string getFileName ( void )
    public string getName ( void )
    public string getNamespaceName ( void )
    public int getNumberOfParameters ( void )
    public int getNumberOfRequiredParameters ( void )
    public array getParameters ( void )
    public ReflectionType getReturnType ( void )
    public string getShortName ( void )
    public int getStartLine ( void )
    public array getStaticVariables ( void )
    public bool hasReturnType ( void )
    public bool inNamespace ( void )
    public bool isClosure ( void )
    public bool isDeprecated ( void )
    public bool isGenerator ( void )
    public bool isInternal ( void )
    public bool isUserDefined ( void )
    public bool isVariadic ( void )
    public bool returnsReference ( void )
    abstract public void __toString ( void )
}
```

<a name="reflectionfunction"></a>
#### ReflectionFunction

报告一个函数的相关信息

```php
ReflectionFunction extends ReflectionFunctionAbstract implements Reflector {
    /* Constants */
    const integer IS_DEPRECATED = 262144 ;
    /* Properties */
    public $name ;
    /* Methods */
    public __construct ( mixed $name )
    public static string export ( string $name [, string $return ] )
    public Closure getClosure ( void )
    public mixed invoke ([ mixed $parameter [, mixed $... ]] )
    public mixed invokeArgs ( array $args )
    public bool isDisabled ( void )
    public string __toString ( void )
    /* Inherited methods */
    final private void ReflectionFunctionAbstract::__clone ( void )
    public ReflectionClass ReflectionFunctionAbstract::getClosureScopeClass ( void )
    public object ReflectionFunctionAbstract::getClosureThis ( void )
    public string ReflectionFunctionAbstract::getDocComment ( void )
    public int ReflectionFunctionAbstract::getEndLine ( void )
    public ReflectionExtension ReflectionFunctionAbstract::getExtension ( void )
    public string ReflectionFunctionAbstract::getExtensionName ( void )
    public string ReflectionFunctionAbstract::getFileName ( void )
    public string ReflectionFunctionAbstract::getName ( void )
    public string ReflectionFunctionAbstract::getNamespaceName ( void )
    public int ReflectionFunctionAbstract::getNumberOfParameters ( void )
    public int ReflectionFunctionAbstract::getNumberOfRequiredParameters ( void )
    public array ReflectionFunctionAbstract::getParameters ( void )
    public ReflectionType ReflectionFunctionAbstract::getReturnType ( void )
    public string ReflectionFunctionAbstract::getShortName ( void )
    public int ReflectionFunctionAbstract::getStartLine ( void )
    public array ReflectionFunctionAbstract::getStaticVariables ( void )
    public bool ReflectionFunctionAbstract::hasReturnType ( void )
    public bool ReflectionFunctionAbstract::inNamespace ( void )
    public bool ReflectionFunctionAbstract::isClosure ( void )
    public bool ReflectionFunctionAbstract::isDeprecated ( void )
    public bool ReflectionFunctionAbstract::isGenerator ( void )
    public bool ReflectionFunctionAbstract::isInternal ( void )
    public bool ReflectionFunctionAbstract::isUserDefined ( void )
    public bool ReflectionFunctionAbstract::isVariadic ( void )
    public bool ReflectionFunctionAbstract::returnsReference ( void )
    abstract public void ReflectionFunctionAbstract::__toString ( void )
}
```

<a name="reflectionclass"></a>
### ReflectionClass

报告一个类的有关信息

```php
ReflectionClass implements Reflector {
    /* Constants */
    const integer IS_IMPLICIT_ABSTRACT = 16 ;
    const integer IS_EXPLICIT_ABSTRACT = 32 ;
    const integer IS_FINAL = 64 ;
    /* Properties */
    public $name ;
    /* Methods */
    public __construct ( mixed $argument )
    public static string export ( mixed $argument [, bool $return = false ] )
    public mixed getConstant ( string $name )
    public array getConstants ( void )
    public ReflectionMethod getConstructor ( void )
    public array getDefaultProperties ( void )
    public string getDocComment ( void )
    public int getEndLine ( void )
    public ReflectionExtension getExtension ( void )
    public string getExtensionName ( void )
    public string getFileName ( void )
    public array getInterfaceNames ( void )
    public array getInterfaces ( void )
    public ReflectionMethod getMethod ( string $name )
    public array getMethods ([ int $filter ] )
    public int getModifiers ( void )
    public string getName ( void )
    public string getNamespaceName ( void )
    public ReflectionClass getParentClass ( void )
    public array getProperties ([ int $filter ] )
    public ReflectionProperty getProperty ( string $name )
    public string getShortName ( void )
    public int getStartLine ( void )
    public array getStaticProperties ( void )
    public mixed getStaticPropertyValue ( string $name [, mixed &$def_value ] )
    public array getTraitAliases ( void )
    public array getTraitNames ( void )
    public array getTraits ( void )
    public bool hasConstant ( string $name )
    public bool hasMethod ( string $name )
    public bool hasProperty ( string $name )
    public bool implementsInterface ( string $interface )
    public bool inNamespace ( void )
    public bool isAbstract ( void )
    public bool isAnonymous ( void )
    public bool isCloneable ( void )
    public bool isFinal ( void )
    public bool isInstance ( object $object )
    public bool isInstantiable ( void )
    public bool isInterface ( void )
    public bool isInternal ( void )
    public bool isIterateable ( void )
    public bool isSubclassOf ( string $class )
    public bool isTrait ( void )
    public bool isUserDefined ( void )
    public object newInstance ( mixed $args [, mixed $... ] )
    public object newInstanceArgs ([ array $args ] )
    public object newInstanceWithoutConstructor ( void )
    public void setStaticPropertyValue ( string $name , string $value )
    public string __toString ( void )
}
```

<a name="reflectionproperty"></a>
#### ReflectionProperty

报告类的属性的相关信息

```php
ReflectionProperty implements Reflector {
    /* Constants */
    const integer IS_STATIC = 1 ;
    const integer IS_PUBLIC = 256 ;
    const integer IS_PROTECTED = 512 ;
    const integer IS_PRIVATE = 1024 ;
    /* Properties */
    public $name ;
    public $class ;
    /* Methods */
    final private void __clone ( void )
    public __construct ( mixed $class , string $name )
    public static string export ( mixed $class , string $name [, bool $return ] )
    public ReflectionClass getDeclaringClass ( void )
    public string getDocComment ( void )
    public int getModifiers ( void )
    public string getName ( void )
    public mixed getValue ([ object $object ] )
    public bool isDefault ( void )
    public bool isPrivate ( void )
    public bool isProtected ( void )
    public bool isPublic ( void )
    public bool isStatic ( void )
    public void setAccessible ( bool $accessible )
    public void setValue ( object $object , mixed $value )
    public string __toString ( void )
}
```

<a name="reflectionmethod"></a>
#### ReflectionMethod

报告类的方法的相关信息

```php
ReflectionMethod extends ReflectionFunctionAbstract implements Reflector {
    /* Constants */
    const integer IS_STATIC = 1 ;
    const integer IS_PUBLIC = 256 ;
    const integer IS_PROTECTED = 512 ;
    const integer IS_PRIVATE = 1024 ;
    const integer IS_ABSTRACT = 2 ;
    const integer IS_FINAL = 4 ;
    /* Properties */
    public $name ;
    public $class ;
    /* Methods */
    public __construct ( mixed $class , string $name )
    public static string export ( string $class , string $name [, bool $return = false ] )
    public Closure getClosure ( object $object )
    public ReflectionClass getDeclaringClass ( void )
    public int getModifiers ( void )
    public ReflectionMethod getPrototype ( void )
    public mixed invoke ( object $object [, mixed $parameter [, mixed $... ]] )
    public mixed invokeArgs ( object $object , array $args )
    public bool isAbstract ( void )
    public bool isConstructor ( void )
    public bool isDestructor ( void )
    public bool isFinal ( void )
    public bool isPrivate ( void )
    public bool isProtected ( void )
    public bool isPublic ( void )
    public bool isStatic ( void )
    public void setAccessible ( bool $accessible )
    public string __toString ( void )
    /* Inherited methods */
    final private void ReflectionFunctionAbstract::__clone ( void )
    public ReflectionClass ReflectionFunctionAbstract::getClosureScopeClass ( void )
    public object ReflectionFunctionAbstract::getClosureThis ( void )
    public string ReflectionFunctionAbstract::getDocComment ( void )
    public int ReflectionFunctionAbstract::getEndLine ( void )
    public ReflectionExtension ReflectionFunctionAbstract::getExtension ( void )
    public string ReflectionFunctionAbstract::getExtensionName ( void )
    public string ReflectionFunctionAbstract::getFileName ( void )
    public string ReflectionFunctionAbstract::getName ( void )
    public string ReflectionFunctionAbstract::getNamespaceName ( void )
    public int ReflectionFunctionAbstract::getNumberOfParameters ( void )
    public int ReflectionFunctionAbstract::getNumberOfRequiredParameters ( void )
    public array ReflectionFunctionAbstract::getParameters ( void )
    public ReflectionType ReflectionFunctionAbstract::getReturnType ( void )
    public string ReflectionFunctionAbstract::getShortName ( void )
    public int ReflectionFunctionAbstract::getStartLine ( void )
    public array ReflectionFunctionAbstract::getStaticVariables ( void )
    public bool ReflectionFunctionAbstract::hasReturnType ( void )
    public bool ReflectionFunctionAbstract::inNamespace ( void )
    public bool ReflectionFunctionAbstract::isClosure ( void )
    public bool ReflectionFunctionAbstract::isDeprecated ( void )
    public bool ReflectionFunctionAbstract::isGenerator ( void )
    public bool ReflectionFunctionAbstract::isInternal ( void )
    public bool ReflectionFunctionAbstract::isUserDefined ( void )
    public bool ReflectionFunctionAbstract::isVariadic ( void )
    public bool ReflectionFunctionAbstract::returnsReference ( void )
    abstract public void ReflectionFunctionAbstract::__toString ( void )
}
```

<a name="reflectionparameter"></a>
### ReflectionParameter

报告一个函数或方法参数的相关信息

```php
ReflectionParameter implements Reflector {
    /* Properties */
    public $name ;
    /* Methods */
    public bool allowsNull ( void )
    public bool canBePassedByValue ( void )
    final private void __clone ( void )
    public __construct ( string $function , string $parameter )
    public static string export ( string $function , string $parameter [, bool $return ] )
    public ReflectionClass getClass ( void )
    public ReflectionClass getDeclaringClass ( void )
    public ReflectionFunctionAbstract getDeclaringFunction ( void )
    public mixed getDefaultValue ( void )
    public string getDefaultValueConstantName ( void )
    public string getName ( void )
    public int getPosition ( void )
    public ReflectionType getType ( void )
    public bool hasType ( void )
    public bool isArray ( void )
    public bool isCallable ( void )
    public bool isDefaultValueAvailable ( void )
    public bool isDefaultValueConstant ( void )
    public bool isOptional ( void )
    public bool isPassedByReference ( void )
    public bool isVariadic ( void )
    public string __toString ( void )
}
```

<a name="reflectiontype"></a>
### ReflectionType

报告函数、类方法的参数或者返回值的类型

```php
ReflectionType {
    /* Methods */
    public bool allowsNull ( void )
    public bool isBuiltin ( void )
    public string __toString ( void )
}
```
