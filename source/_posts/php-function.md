
---

title: php 易忘函数
date: 2017-07-14
tag: [php]

---

收集整理一些不太常用但很可能会用的php内建函数。

不定时更新

<!-- MarkdownTOC -->

- [chr & ord](#chr--ord)
- [explode & implode & join & str_split](#explode--implode--join--strsplit)
- [parse_str](#parsestr)
- [mysql_fetch_row & mysql_fetch_array & mysql_fetch_assoc](#mysqlfetchrow--mysqlfetcharray--mysqlfetchassoc)

<!-- /MarkdownTOC -->

<a name="chr--ord"></a>
### chr & ord

chr()生成ASCII值对应的字符，ord()生成字符对应的ASCII值

<a name="explode--implode--join--strsplit"></a>
### explode & implode & join & str_split

explode()将给定的字符串拆分为数组，implode()将给定的数组合并为字符串，join()是implode()的别名。

    array explode ( string $delimiter , string $string [, int $limit = PHP_INT_MAX ] )
 
    string implode ( [string $glue ,] array $pieces )

str_split()按固定长度将给定字符串拆分为数组。

    array str_split ( string $string [, int $split_length = 1 ] )

示例：

```php
// Example 1 explode()
$pizza  = "piece1 piece2 piece3 piece4 piece5 piece6";
$pieces = explode(" ", $pizza);
echo $pieces[0];     // piece1
echo $pieces[1];     // piece2

// Example 2 explode()
$data = "foo:*:1023:1000::/home/foo:/bin/sh";
list($user, $pass, $uid, $gid, $gecos, $home, $shell) = explode(":", $data);
echo $user;          // foo
echo $pass;          // *

// Example 3 implode()
$array = array('lastname', 'email', 'phone');
echo implode(",", $array);    // lastname,email,phone

// Example 4 str_split()
$str = "Hello Friend";
$arr = str_split($str, 3);    // Array(0 => Hel, 1 => lo, 2 => Fri, 3 => end)
```

<a name="parsestr"></a>
### parse_str

parse_str从特殊的字符串（类似url中变量形式）构造变量并赋值。

    void parse_str ( string $encoded_string [, array &$result ] )

示例：

```php
$str = "first=value&arr[]=foo+bar&arr[]=baz";

// Recommended 推荐，给定输出数组，生成键值对
parse_str($str, $output);
echo $output['first'];  // value
echo $output['arr'][0]; // foo bar
echo $output['arr'][1]; // baz

// DISCOURAGED 不推荐，不给定输出数组，会直接生成变量
parse_str($str);
echo $first;  // value
echo $arr[0]; // foo bar
echo $arr[1]; // baz
```

<a name="mysqlfetchrow--mysqlfetcharray--mysqlfetchassoc"></a>
### mysql_fetch_row & mysql_fetch_array & mysql_fetch_assoc

mysql_fetch_row 从结果集中取得一行作为枚举数组，通过数字索引获取对应值。

    array mysql_fetch_row ( resource $result )

mysql_fetch_array 从结果集中取得一行作为关联数组，或数字数组，或二者兼有。

    array mysql_fetch_array ( resource $result [, int $ result_type ] )

array_type规定返回哪种结果。可能的值：
- MYSQL_ASSOC - 关联数组
- MYSQL_NUM - 数字数组
- MYSQL_BOTH - 默认。同时产生关联和数字数组

```php
$result = mysql_query("SELECT id, name FROM mytable");

// 数字数组，相当于array_fetch_row
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
    printf("ID: %s  Name: %s", $row[0], $row[1]);  
}
// 关联数组，相当于array_fetch_assoc
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    printf("ID: %s  Name: %s", $row["id"], $row["name"]);
}
// 两者都有
while ($row = mysql_fetch_array($result, MYSQL_BOTH)) {
    printf ("ID: %s  Name: %s", $row[0], $row["name"]);
}
```

mysql_fetch_assoc — 从结果集中取得一行作为关联数组，和用 mysql_fetch_array() 加上第二个可选参数 MYSQL_ASSOC 完全相同。

    array mysql_fetch_assoc ( resource $result )
