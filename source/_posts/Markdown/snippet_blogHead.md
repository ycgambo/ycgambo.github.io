---
title: Markdown头部Snippet
date: 2017/11/07 16:11:18
categories: Markdown
tags:
    - Markdown
    - Snippet
---

我的通用的博客头Snippet，实现了博文摘要、目录、转载链接等功能，利用一些Snippet工具就能很简单的创建博文开头。

目录：
<!-- MarkdownTOC -->

- [格式](#%E6%A0%BC%E5%BC%8F)
- [应用](#%E5%BA%94%E7%94%A8)
- [例子](#%E4%BE%8B%E5%AD%90)

<!-- /MarkdownTOC -->

<!-- more -->

> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>


<a name="%E6%A0%BC%E5%BC%8F"></a>
## 格式

```markdown
---
title: 
date: 
categories: 
tags:
    - 
---



目录：
<!-- MarkdownTOC -->

<!-- /MarkdownTOC -->

<!-- more -->

> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>

```

<a name="%E5%BA%94%E7%94%A8"></a>
## 应用

```markdown
---
title: 文章标题
date: 日期
categories: 类目名
tags:
    - 一级标签
    - 二级标签
    - 等等
---

这里是博文摘要。

目录：
<!-- MarkdownTOC -->
供SublimeText的MarkdownTOC插件使用，会在保存时自动更新目录结构。
<!-- /MarkdownTOC -->

<!-- more --> Hexo的Next主题具有折叠功能，这条语句下面的内容会被折叠。

博文的转载链接。
> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

自动为博文生成转载链接，免去了很多麻烦。注意上下都有换行，并且其中不能有换行，否则Markdown解析时会破坏脚本，使之不能工作。
<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>  这里画了一条横线，下面的内容就是正文内容啦。

```

<a name="%E4%BE%8B%E5%AD%90"></a>
## 例子

本文的Snippet修改后是这样的：

```markdown
---
title: Markdown头部Snippet
date: 2017/11/07 16:11:18
categories: Markdown
tags:
    - Markdown
    - Snippet
---

我的通用的博客头Snippet，实现了博文摘要、目录、转载链接等功能。

目录：
<!-- MarkdownTOC -->

- [格式](#%E6%A0%BC%E5%BC%8F)
- [应用](#%E5%BA%94%E7%94%A8)
- [例子](#%E4%BE%8B%E5%AD%90)

<!-- /MarkdownTOC -->

<!-- more -->

> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>

```

- date是编写Alfred的workflow输出的
- 目录是SublimeText的Markdown插件自动生成的，并且加了锚点
- 转载声明在浏览器解析时会自动变成这边博文的地址
