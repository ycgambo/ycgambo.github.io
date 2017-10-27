
---

title: bootstrap+php 轮播辅助类
date: 2017-07-01
tag: [bootstrap, php]

---

bootstrap的轮播存在几层定义，修改起来比较麻烦。

可以在php中定义辅助类、利用配置文件定义轮播内容，在view层控制文件中读取配置，并调用辅助类输出，从而实现轻松修改。

可以直接拷贝使用。

<!-- MarkdownTOC -->

- [引入文件](#引入文件)
- [php配置文件](#php配置文件)
- [CarouselInserter辅助类](#carouselinserter辅助类)
- [view层控制器](#view层控制器)

<!-- /MarkdownTOC -->

<a name="引入文件"></a>
## 引入文件

页面需要包含以下文件：

http://cdn.static.runoob.com/libs/bootstrap/3.3.7/css/bootstrap.min.css
http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js
http://cdn.static.runoob.com/libs/bootstrap/3.3.7/js/bootstrap.min.js

<a name="php配置文件"></a>
## php配置文件

以下变量定义了轮播的行为。

修改轮播内容时，只需在`$GLOBALS['CAROUSEL_INDEX_TOP_PATH']`中加入路径，php辅助类会处理css和js的行为。

`$GLOBALS['CAROUSEL_INDEX_TOP_BUTTON']`定义了轮播控制按钮，需要时加入与路径对应的按钮名即可。

```php
// active the carousel at top of index page or not
$GLOBALS['CAROUSEL_INDEX_TOP_ACTIVE'] = true;
// PATH array stores the path of each picture which the carousel shows
$GLOBALS['CAROUSEL_INDEX_TOP_PATH'] = array(
    STATIC_HOST . '/img/slide/sample_1.jpg',
    STATIC_HOST . '/img/slide/sample_2.jpg',
    STATIC_HOST . '/img/slide/sample_3.jpg',
    STATIC_HOST . '/img/slide/sample_4.jpg',
    STATIC_HOST . '/img/slide/sample_5.jpg',
);
// BUTTON array stores the name of each buttons which under the carousel
// all these button names MUST be listed in order, corresponding to CAROUSEL_INDEX_TOP_PATH
// if you don't want to name some button, define them as empty string('')
$GLOBALS['CAROUSEL_INDEX_TOP_BUTTON'] = array(
);
// the id of the carousel picture path inside CAROUSEL_INDEX_TOP_PATH that shows as default
$GLOBALS['CAROUSEL_INDEX_TOP_DEFAULT_ID'] = 0;
```

<a name="carouselinserter辅助类"></a>
## CarouselInserter辅助类

该类仅有一个公共函数insert，以输出生成的bootstrap轮播代码。

由于是view层，该类混杂了php代码和html代码，存在两个代码缩进层次，一个为php的缩进，一个为html的缩进。

采用两层缩进可以使产生的html代码更美观，方便前端人员理解。

静态变量`$_num`是为了使每次调用insert时都会产生不同的轮播id，以免冲突。

```php
<?php

class CarouselInserter
{
    // counter, to define different carouse_id__ when every time calls insert()
    static $_num = 0;

    /**
     * @path__          normal array, the path of each carouse picture
     * @btn__           normal array, the button name under carouse, corresponding to path__
     * @default_id__    integer, the default picture shows in carouse
     */
    public function insert(array $path__, array $btn__ = null, $default_id__ = 0)
    {
        self::$_num  += 1;
        $insert_num__ = count($path__);
        $carouse_id__ = 'Carousel-'. self::$_num;
        $indicators__ = '';
        $inners__     = '';
        $btns__       = '';
        $btns_js__    = '';

        echo '
<div id="'. $carouse_id__ . '" class="carousel slide">
   <ol class="carousel-indicators">';
        for ($insert_curr_num__ = 0; $insert_curr_num__ < $insert_num__; $insert_curr_num__++) {
            $indicators__ .= '
        <li data-target="#'. $carouse_id__ . '" data-slide-to="'. $insert_curr_num__ . '"';
            if ($insert_curr_num__ == $default_id__)
                $indicators__ .= ' class="active"';
            $indicators__ .= '></li>';
        }
        echo $indicators__ . '
   </ol>
   <div class="carousel-inner">';
        for ($insert_curr_num__ = 0; $insert_curr_num__ < $insert_num__; $insert_curr_num__++) {
            $inners__ .= '
      <div class="item';
            if ($insert_curr_num__ == $default_id__)
                $inners__ .= ' active';
            $inners__ .= '">';
            $inners__ .= '
         <img src="' . $path__[$insert_curr_num__] . '">
      </div>';
        }
        echo $inners__ . '
   </div>
   <a class="carousel-control left" href="#' . $carouse_id__ . '" data-slide="prev">&lsaquo;</a>
   <a class="carousel-control right" href="#' . $carouse_id__ . '" data-slide="next">&rsaquo;</a>';
        if ($btn__ != null && count($btn__) != 0) {
            $btns__ .= '
   <div style="text-align:center;">';
            for ($insert_curr_num__ = 0; $insert_curr_num__ < $insert_num__; $insert_curr_num__++) {
                if ($btn__[$insert_curr_num__] != '')
                    $btns__ .= '
      <input type="button" class="btn slide-' . $insert_curr_num__ . '" value="' . $btn__[$insert_curr_num__] . '">';
            }
            echo $btns__ . '
   </div>
</div>
<script>
   $(function(){';
            for ($insert_curr_num__ = 0; $insert_curr_num__ < $insert_num__; $insert_curr_num__++) {
                if ($btn__[$insert_curr_num__] != '')
                    $btns_js__ .= '
      $(".slide-' . $insert_curr_num__ . '").click(function(){
         $("#'. $carouse_id__ . '").carousel(' . $insert_curr_num__ . ');
      });';
            }
            echo $btns_js__ . '
   });
</script>';
        } else {
            echo '
</div>';
        }
    }
}
```

<a name="view层控制器"></a>
## view层控制器

控制器可以是你的view层控制器，也可以是其下的辅助类，调用上面的配置文件和辅助类输出轮播代码。

```php
if (isset($GLOBALS['CAROUSEL_INDEX_TOP_ACTIVE']) && $GLOBALS['CAROUSEL_INDEX_TOP_ACTIVE'] == true){
    include_once ROOT.'/views/http/CarouselInserter.class.php';
    $carousel_inseter__ = new CarouselInserter();
    $carousel_inseter__->insert($GLOBALS['CAROUSEL_INDEX_TOP_PATH'], $GLOBALS['CAROUSEL_INDEX_TOP_BUTTON'], $GLOBALS['CAROUSEL_INDEX_TOP_DEFAULT_ID']);
}
```
