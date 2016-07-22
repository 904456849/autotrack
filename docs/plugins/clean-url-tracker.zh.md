# `cleanUrlTracker`

这份指南解释什么是`cleanUrlTracker`插件以及如果将它整合到你的`analytics.js`跟踪实施中去。

## 概览

当在谷歌分析中查看访问最多的页面时，一定会看到多种不用的URL路径但它们其实是同一个页面。下面的表格报告就是一个很好的例子，这个让人难受的例子许多用户都在随时找出来：

<table>
  <tr valign="top">
    <th align="left">页面</th>
    <th align="left">页面浏览</th>
  </tr>
  <tr valign="top">
    <td>/contact</td>
    <td>967</td>
  </tr>
  <tr valign="top">
    <td>/contact/</td>
    <td>431</td>
  </tr>
  <tr valign="top">
    <td>/contact?hl=en</td>
    <td>67</td>
  </tr>
  <tr valign="top">
    <td>/contact/index.html</td>
    <td>32</td>
  </tr>
</table>

为了搞定这个困难，最后是设置一个单独标准化的URL路径给每个加入跟踪的页面，并且仅发送这个唯一版本给谷歌分析。

这个`cleanUrlTracker`插件帮助很大。它可以让你指定一个你喜好或者可以排除所有不相干部分的URL路径，这样可以规范化所有的URL。

### 工作原理

这个`cleanUrlPlugin`可以通过拦截各个发送的请求并且给予在配置[选择](#选择)设置的规则中编辑[`page`](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#page)字段。

如果`page`字段不存在，就会创建一个基于从[`location`](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#location)字段的URL路径。

**注意：** 当`cleanUrlTracker`插件可以对每次请求编辑`page`字段值，它将不会编辑`location`字段。这允许项目和站内搜索数据编码在预处理的完整URL内。

## 用法

启动`cleanUrlTracker`插件，运行[`require`](https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins)命令，指定插件名字，然后传值到你要使用的配置选项中去：

```js
ga('require', 'cleanUrlTracker', options);
```

## 选项

下面的表格列举了所有可能的`cleanUrlTracker`插件配置选项。如果任何的选项有一个默认值，会明确地标出：

<table>
  <tr valign="top">
    <th align="left">Name名字</th>
    <th align="left">Type类似</th>
    <th align="left">Default默认</th>
  </tr>
  <tr valign="top">
    <td><code>stripQuery</code></a></td>
    <td><code>boolean</code></a></td>
    <td>
      当为<code>true</code>时，URL问号后的查询字符串部分会被移除。<br>
      <strong>默认值:</strong> <code>false</code>
    </td>
  </tr>
  <tr valign="top">
    <td><code>queryDimensionIndex</code></a></td>
    <td><code>number</code></a></td>
    <td>
      有一些情况你需要从URL里头去除掉查询字符串，但你仍要记录原始的查询字符串是什么，这样你可以在报表里面看到各自的数据。你可以在谷歌分析通过创建一个新的<a href="https://support.google.com/analytics/answer/2709829">自定义维度</a>来实现。设置这个维护的<a href="https://support.google.com/analytics/answer/2709828#example-hit">范围</a>为"hit"，然后将这个新创建的维度的索引设置为<code>queryDimensionIndex</code>选项。一旦设置成功，被移除掉的查询字符串就会在自定义维度指定好了的索引中。
    </td>
  </tr>
  <tr valign="top">
    <td><code>indexFilename</code></a></td>
    <td><code>string</code></a></td>
    <td>
      如果有设置，<code>indexFilename</code>值会从URL的结尾去除掉。如有你的服务器自动支持index文件名，你需要设置你用的index文件名。（通常用<code>'index.html'</code>）
    </td>
  </tr>
  <tr valign="top">
    <td><code>trailingSlash</code></a></td>
    <td><code>string</code></a></td>
    <td>
    当设置<code>'add'</code>时，反斜杠会被加到所有的URL的结尾（如果本来就没有）。当设置<code>'remove'</code>，反斜杠会从所有的URL结尾移除。如果设置其它的值，将不会改变什么。注意：当使用<code>indexFilename</code>选项，在反斜杠添加或去除之前文件的index名 会被去除掉。
    </td>
  </tr>
</table>

## 方法

下面的表格列举了所有`cleanUrlTracker`插件的方法：

<table>
  <tr valign="top">
    <th align="left">名字</th>
    <th align="left">描述</th>
  </tr>
  <tr valign="top">
    <td><code>remove</code></a></td>
    <td>从指定的跟踪器移除<code>cleanUrlTracker</code>插件并且在插件被引入之前保存原始状态的修改。</td>
  </tr>
</table>

关于`analytics.js`插件的工具原理细节以及如何调用它们，请看在`analytics.js`文档里面的[调用插件方法](https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins#calling_plugin_methods)。

## 例子

给定在开头指南展示的四个URL，下面的`cleanUrlTracker`配置将会确保只有URL路径`/contact`会出现在你的报表里（假定你有创建一个自定义维度索引1）：

```js
ga('require', 'cleanUrlTracker', {
  stripQuery: true,
  queryDimensionIndex: 1,
  indexFilename: 'index.html',
  trailingSlash: 'remove'
});
```

给定的那四个URL，下面的字段将会在每次各自的请求里给发送到谷歌分析中：

```
[1] {
      "location": "/contact",
      "page": "/contact"
    }

[2] {
      "location": "/contact/",
      "page": "/contact"
    }

[3] {
      "location": "/contact?hl=en",
      "page": "/contact"
      "dimension1": "hl=en"
    }

[4] {
      "location": "/contact/index.html",
      "page": "/contact"
    }
```
