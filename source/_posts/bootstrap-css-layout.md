
---

title: bootstrap-css-布局
date: 2017-06-28
tag: [bootstrap]

---


源文件：   bootstrap.css

版本：     v2.3.2

抽出bootstrap **布局** 相关的css源码

bootstrap的布局体系能使页面在不同设备下拥有自适应的布局，依照它的布局方法，可以大大缩减页面的调试周期。

bootstrap将页面分为两种布局类型，一种为普通的container容器，大小为940px；一种为container-fluid类型的满屏布局，页面按 **百分比** 划分。

其次是它的栅格体系，将 **1行分为11列** ，然后为区域指定列数。如果一行指定列数后超过11列，则在新行中显示。

本文只分析css代码，至于如何分区，请参考官方教程。

<!-- MarkdownTOC -->

- [摘要](#摘要)
    - [clearfix](#clearfix)
    - [container & container-fluid](#container--container-fluid)
    - [span & offset](#span--offset)
    - [row & row-fluid](#row--row-fluid)
    - [pull-left & pull-right](#pull-left--pull-right)
- [源码](#源码)
    - [container](#container)
    - [container-fluid](#container-fluid)
    - [row](#row)
    - [row-fluid](#row-fluid)

<!-- /MarkdownTOC -->

<a name="摘要"></a>
## 摘要

<a name="clearfix"></a>
### clearfix

```
.clearfix {
  清除浮动;
}
```

<a name="container--container-fluid"></a>
### container & container-fluid

```
.container,
.navbar-static-top .container,
.navbar-fixed-top .container,
.navbar-fixed-bottom .container {
  width: 940px;
  清除浮动;
}
.navbar .container{
  width: auto;
}

.container-fluid {
  padding: 0 20px;
  清除浮动;
}
```

<a name="span--offset"></a>
### span & offset

```
.span1-12    {width: px}
.offset1-12  {margin-left: px}
```

<a name="row--row-fluid"></a>
### row & row-fluid

```
.row {
  margin-left: -20px;
  清除浮动;
}

.row-fluid {
  width: 100%;
  清除浮动;
}

.row-fluid [class*="span"] {
  display:          block;
  float:            left;
  margin-left:      2.127659574468085%;
  min-height:       30px;
  box-sizing:       border-box;
  :first-child      {margin-left: 0;}
  .pull-right       {float: right;}
  .hide             {display none;}
}

.row-fluid .span1-12    {width: xx%}
.row-fluid .offset1-12  {margin-left: xx%}

.row-fluid .controls-row [class*="span"] + [class*="span"] {
  margin-left: 2.127659574468085%;
}
```

<a name="pull-left--pull-right"></a>
### pull-left & pull-right

```
.pull-right {
  float: right;
}

.pull-left {
  float: left;
}
```

<a name="源码"></a>
## 源码

<a name="container"></a>
### container

```css
<!-- 第288行 -->
.container,
.navbar-static-top .container,
.navbar-fixed-top .container,
.navbar-fixed-bottom .container {
  width: 940px;
}

<!-- 第617行 -->
<!-- 清除浮动 -->
.container {
  margin-right: auto;
  margin-left: auto;
  *zoom: 1;
}
.container:before,
.container:after {
  display: table;
  line-height: 0;
  content: "";
}
.container:after {
  clear: both;
}

<!-- 第4405行 -->
.navbar .container {
  width: auto;
}

<!-- 第4569行 -->
<!-- 重复代码 -->
.navbar-static-top .container,
.navbar-fixed-top .container,
.navbar-fixed-bottom .container {
  width: 940px;
}
```

<a name="container-fluid"></a>
### container-fluid

```css
<!-- 第617行 -->
.container-fluid {
  padding-right: 20px;
  padding-left: 20px;
  *zoom: 1;
}
.container-fluid:before,
.container-fluid:after {
  display: table;
  line-height: 0;
  content: "";
}
.container-fluid:after {
  clear: both;
}
```

<a name="row"></a>
### row

```css
<!-- 第266行 -->
.row {
  margin-left: -20px;
  *zoom: 1;
}
.row:before,
.row:after {
  display: table;
  line-height: 0;
  content: "";
}
.row:after {
  clear: both;
}
```

<a name="row-fluid"></a>
### row-fluid

```css
<!-- 第391行 -->
.row-fluid {
  width: 100%;
  *zoom: 1;
}
.row-fluid:before,
.row-fluid:after {
  display: table;
  line-height: 0;
  content: "";
}
.row-fluid:after {
  clear: both;
}
.row-fluid [class*="span"] {
  display: block;
  float: left;
  width: 100%;
  min-height: 30px;
  margin-left: 2.127659574468085%;
  *margin-left: 2.074468085106383%;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
.row-fluid [class*="span"]:first-child {
  margin-left: 0;
}
.row-fluid .controls-row [class*="span"] + [class*="span"] {
  margin-left: 2.127659574468085%;
}
.row-fluid .span12 {
  width: 100%;
  *width: 99.94680851063829%;
}
.row-fluid .offset12 {
  margin-left: 104.25531914893617%;
  *margin-left: 104.14893617021275%;
}
[class*="span"].hide,
.row-fluid [class*="span"].hide {
  display: none;
}
[class*="span"].pull-right,
.row-fluid [class*="span"].pull-right {
  float: right;
}

<!-- 第1308行 -->
input[class*="span"],
select[class*="span"],
textarea[class*="span"],
.uneditable-input[class*="span"],
.row-fluid input[class*="span"],
.row-fluid select[class*="span"],
.row-fluid textarea[class*="span"],
.row-fluid .uneditable-input[class*="span"] {
  float: none;
  margin-left: 0;
}
.input-append input[class*="span"],
.input-append .uneditable-input[class*="span"],
.input-prepend input[class*="span"],
.input-prepend .uneditable-input[class*="span"],
.row-fluid input[class*="span"],
.row-fluid select[class*="span"],
.row-fluid textarea[class*="span"],
.row-fluid .uneditable-input[class*="span"],
.row-fluid .input-prepend [class*="span"],
.row-fluid .input-append [class*="span"] {
  display: inline-block;
}
```
