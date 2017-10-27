
---

title: bootstrap-css-导航
date: 2017-06-29
tag: [bootstrap]

---


源文件：   bootstrap.css

版本：     v2.3.2

抽出bootstrap *导航* 相关的css源码

本文仍在更新中

导航`nav`相关的定义在3948行到4947行之间，这里只拷贝出重要的源码分析，大部分源码将用语言带过，并略过一些次要代码。

<!-- MarkdownTOC -->

- [摘要](#摘要)
    - [nav](#nav)
- [源码](#源码)

<!-- /MarkdownTOC -->


<a name="摘要"></a>
## 摘要

<a name="nav"></a>
### nav

```
.nav {
  margin-bottom: 20px;
  margin-left: 0;
  list-style: none;
}
```

此外，将`.nav > li > a`定义为block，背景色设为`#eeeeee`。

`.nav-header`定义font为bold，并有1px的text-shadow。

`.nav-list`定义了菜单列表（下拉菜单），`.nav-list .divider`生成一个菜单中的分隔符。

<a name="源码"></a>
## 源码