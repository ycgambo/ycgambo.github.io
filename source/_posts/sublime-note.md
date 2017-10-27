
---

title: sublime text3 备忘笔记
date: 2017-06-29
tag:  [sublime]

---


个人sublime text备忘录。

记录一些命令、插件、修改过的文件。

<!-- MarkdownTOC -->

- [Snippets](#snippets)
- [Addon](#addon)
    - [Markdown](#markdown)
    - [PHP](#php)
    - [SideBar](#sidebar)

<!-- /MarkdownTOC -->

<a name="snippets"></a>
## Snippets

- lorem:    生成一段测试文本

<a name="addon"></a>
## Addon

<a name="markdown"></a>
### Markdown

- Markdown Editing
- MarkdownTOC
- MarkdownTableFormatter
- OmniMarkupPreviewer

```
// Markdown GFM setting
{
    "color_scheme": "Packages/MarkdownEditing/MarkdownEditor-Dark.tmTheme",
    "wrap_width": 100,
    "rulers": [-3, 103],
    "line_numbers": true,
}
```

修改MarkdownEditor-Dark主题为Solarized风格：
[MarkdownEditing.sublime-package](/backup/sublime/MarkdownEditing.sublime-package)

<a name="php"></a>
### PHP

- php-grammar
- php-snippets
- PhpDoc
- DocPHPManualer

<a name="sidebar"></a>
### SideBar

- SideBarEnhancements
- SyncedSidebarBg
- A File Icon

修改侧边栏图标以适应Solarized主题：
[Theme - Default.sublime-package](/backup/sublime/Theme - Default.sublime-package)