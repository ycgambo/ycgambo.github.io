---
title: ssh加载同一域名下的不同密钥
date: 2017/11/05 17:11:21
categories: Operation
tags:
    - Operation
    - Common
    - ssh
---

本文以GitHub为例，实现一台终端操作多个GitHub仓库时，自动加载相应密钥，避免了手动切换密钥的麻烦，有利于脚本化操作。文中贴出了我的ssh配置文件，大家可以参考一下。

目录：
<!-- MarkdownTOC -->

- [密钥对命名要合理](#%E5%AF%86%E9%92%A5%E5%AF%B9%E5%91%BD%E5%90%8D%E8%A6%81%E5%90%88%E7%90%86)
- [利用config文件选择相应密钥](#%E5%88%A9%E7%94%A8config%E6%96%87%E4%BB%B6%E9%80%89%E6%8B%A9%E7%9B%B8%E5%BA%94%E5%AF%86%E9%92%A5)

<!-- /MarkdownTOC -->

<!-- more -->

> 转载请注明出处：<a id="reproduction_link">www.notee.cc</a>

<script type="text/javascript">document.getElementById('reproduction_link').innerHTML = window.location.href;document.getElementById('reproduction_link').href = window.location.href;</script>

<hr>

<a name="%E5%AF%86%E9%92%A5%E5%AF%B9%E5%91%BD%E5%90%8D%E8%A6%81%E5%90%88%E7%90%86"></a>
## 密钥对命名要合理

```
> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (~/.ssh/id_rsa):
```

此时请键入合适的路径以及文件名，不要使用默认名称。我的命名方法是`git.用户名.仓库名`，如下：

```
> ll ~/.ssh
-rw-r--r--  1 ycgambo  staff   469B Nov  5 14:03 config
-rw-------  1 ycgambo  staff   1.6K Oct 29 17:02 git.ycgambo
-rw-------  1 ycgambo  staff   1.6K Nov  5 14:02 git.ycgambo.hexo-theme-next
-rw-r--r--  1 ycgambo  staff   401B Nov  5 14:02 git.ycgambo.hexo-theme-next.pub
-rw-------  1 ycgambo  staff   1.6K Oct 29 17:03 git.ycgambo.notee.cc
-rw-r--r--  1 ycgambo  staff   401B Oct 29 17:03 git.ycgambo.notee.cc.pub
-rw-r--r--  1 ycgambo  staff   401B Oct 29 17:02 git.ycgambo.pub
-rw-------  1 ycgambo  staff   1.6K Oct 29 17:04 git.ycgambo.ycgambo.github.io
-rw-r--r--  1 ycgambo  staff   401B Oct 29 17:04 git.ycgambo.ycgambo.github.io.pub
```

这样生成的密钥对容易辨识，也容易记忆。

<a name="%E5%88%A9%E7%94%A8config%E6%96%87%E4%BB%B6%E9%80%89%E6%8B%A9%E7%9B%B8%E5%BA%94%E5%AF%86%E9%92%A5"></a>
## 利用config文件选择相应密钥

`HostName`都是`github.com`，此时通过`Host`来区分不同的仓库，然后加载相应的密钥(`IdentityFile`)。

```
> cat ~/.ssh/config

# github的登录密钥
Host github.com
    User git
    HostName github.com
    IdentityFile ~/.ssh/git.ycgambo

# github的notee.cc仓库
Host github.com/notee.cc
    User git
    HostName github.com
    IdentityFile ~/.ssh/git.ycgambo.notee.cc

# github的ycgambo.github.io仓库
Host github.com/ycgambo.github.io
    User git
    HostName github.com
    IdentityFile ~/.ssh/git.ycgambo.ycgambo.github.io

# github的hexo-theme-next仓库
Host github.com/hexo-theme-next
    User git
    HostName github.com
    IdentityFile ~/.ssh/git.ycgambo.hexo-theme-next
```

这样ssh就可以在同一域名下加载不同的密钥了。
