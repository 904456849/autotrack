# Autotrack [![Build Status](https://travis-ci.org/googleanalytics/autotrack.svg?branch=master)](https://travis-ci.org/googleanalytics/autotrack)

- [概览](#概览)
- [插件](#插件)
- [安装及用法](#安装及用法)
  - [通过npm加载autotrack](#通过npm加载autotrack)
  - [设置配置选项](#设置配置选项)
- [高级用法](#高级用法)
  - [自定义创建](#自定义创建)
  - [autotrack多个跟踪器使用](#autotrack多个跟踪器使用)
- [浏览器支持](#浏览器支持)
- [翻译](#翻译)

## 概览

默认的谷歌分析的[Javascript跟踪代码](https://developers.google.com/analytics/devguides/collection/analyticsjs/)的运行方式是一旦网页加载的时候就发送一个pageview给谷歌分析。但如果你想跟踪的不仅仅页面浏览（比如： 事件，社交互动行为），你还需要布置一些其他的代码来获取更多的信息。

由于大部分站长关心的用户交互行为的类型都是大同小异，这使得针对新网站（页面）的跟踪有时候就需要遇到一遍又一遍写重复代码的工作。

Autotrack就是为了来解决这个问题的。它除了提供了大部分人所关心的网站行为的标准跟踪以外，还有提供了一些方便跟踪的功能（比如：事件跟踪声明）使得更加容易地理解和分析用户是如何使用你的网站的。

## 插件

这个`autotrack.js`文件很小（压缩后才6KB），包含了下面列举的插件。所有的插件不仅可以一起使用，还可以单独被调用和配置。这个表格包含了每个插件的简要介绍；你可以点击插件名来看完成的文档和用法说明：

<table>
  <tr>
    <th align="left">插件</th>
    <th align="left">说明</th>
  </tr>
  <tr>
    <td><a href="/docs/plugins/clean-url-tracker.zh.md"><code>cleanUrlTracker</code></a></td>
    <td>保证URL路径在谷歌分析报表的一致性；避免同一个页面但不同URL导致出现在不同行的问题。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/event-tracker.zh.md"><code>eventTracker</code></a></td>
    <td>开启事件跟踪声明，通过在markup内的HTML属性。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/impression-tracker.zh.md"><code>impressionTracker</code></a></td>
    <td>允许你跟踪在viewport可视的元素。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/media-query-tracker.zh.md"><code>mediaQueryTracker</code></a></td>
    <td>允许跟踪媒体查询匹配和改变。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/outbound-form-tracker.zh.md"><code>outboundFormTracker</code></a></td>
    <td>自动跟踪导出表单提交。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/outbound-link-tracker.zh.md"><code>outboundLinkTracker</code></a></td>
    <td>自动跟踪导出链接点击。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/page-visibility-tracker.zh.md"><code>pageVisibilityTracker</code></a></td>
    <td>跟踪页面可见度的状态改变，可以使得会话，会话时长和页面指标更准确。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/social-widget-tracker.zh.md"><code>socialWidgetTracker</code></a></td>
    <td>自动跟踪Facebook和Twitter小部件的用户交互行为。</td>
  </tr>
  <tr>
    <td><a href="/docs/plugins/url-change-tracker.zh.md"><code>urlChangeTracker</code></a></td>
    <td>自动跟踪单页面应用的URL变化。</td>
  </tr>
</table>

**免责声明:** 目前autotrack是由谷歌分析开发平台团队在维护，主要为开发者服务。这并不是一个谷歌分析官方的产品同时也不具备有谷歌分析360的支持。用这个组件的开发者需要负责和确保他们的代码部署可以满足[谷歌分析服务条款](https://www.google.com/analytics/terms/us.html)以及他们所在国家的相应法律义务。

## 安装及用法

添加autotrack到你的网站上，必须先做两件事情：

1. 加载`autotrack.js`脚本文件在你的网页里面。
2. 更新[跟踪代码](https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference)来[引入](https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins) 各种你想要用的autotrack的插件。

如果您的网站已经包含标准的JavaScript跟踪代码，你可以用下面的代码进行编辑：

```html
<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');

// 替换下面你想要引入的插件的代码行。
ga('require', 'eventTracker');
ga('require', 'outboundLinkTracker');
ga('require', 'urlChangeTracker');
// ...

ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
<script async src='path/to/autotrack.js'></script>
```

当然，你还有要做下面的更改来自定义autotrack以实现你的需要：

- 替换`UA-XXXXX-Y`成你的[跟踪ID](https://support.google.com/analytics/answer/1032385)
- 替换声明在`require`的插件例子，改成你需要的用的插件。
- 替换`path/to/autotrack.js`成`autotrack.js`文件在你网站的真实路径。

**注意：** 这个[analytics.js插件系统](https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins)的设计目的就是为了支持异步加载脚本，所以`autotrack.js`和`analytics.js`的加载顺序在前在后是没有影响的。而且`autotrack.js`库单独或者和剩下的JavaScript代码绑在一起加载也是没有影响。

### 通过npm加载autotrack

如果你使用npm和模块加载器比如[Browserify](http://browserify.org/), [Webpack](https://webpack.github.io/), 或者[SystemJS](https://github.com/systemjs/systemjs)，你就可以像引入其他的npm模块调用一样将autotrack引入到你的构建（build)中去:

```sh
npm install autotrack
```

```js
// 在你的JavaScript代码中
require('autotrack');
```

上面的代码将会引入所有autotrack的插件在你生成的代码文件中。如果你仅仅只是需要包含指定的插件集，你可以单独地引入它们：

```js
// 在你的JavaScript代码中
require('autotrack/lib/plugins/clean-url-tracker');
require('autotrack/lib/plugins/outbound-link-tracker');
require('autotrack/lib/plugins/url-change-tracker');
// ...
```

上面的例子介绍如何引入插件代码到你最后生成JavaScript文件，这是完成两步安装过程的第一步。

你仍需要更新你的跟踪代码并且引入你需要使用的插件：

```js
// 在analytics.js跟踪代码中
ga('create', 'UA-XXXXX-Y', 'auto');

// 替换下面为你需要使用的插件代码行。
ga('require', 'cleanUrlTracker');
ga('require', 'outboundLinkTracker');
ga('require', 'urlChangeTracker');
// ...

ga('send', 'pageview');
```

**注意：** 请小心不要混淆node模块中的[`require`](https://nodejs.org/api/modules.html)和`analytics.js`中 [`require`](https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#require)的命令。当加载通过npm模块加载器加载autotrack的时候，两个require（引入）都必须用到。

### 设置配置选项

所有的插件都接受一个配置选项来作为`require`命令中的第三个参数。

部分插件（比如`outboundLinkTracker`, `socialWidgetTracker`, `urlChangeTracker`）默认对大部分人有效是不需要指定任何选项。为了使其运行其他的插件（比如`cleanUrlTracker`, `impressionTracker`, `mediaQueryTracker`）需要设定指定的配置选项。

请看独立插件文档提及每个插件接受哪些选项（和哪些默认的值，或者其他）。

## 高级用法

### 自定义创建

这个autotrack库是模块化创立的，每一个插件都包含了它们自己的依赖，所以你可以创建一个自定义库，使用脚本打包的方式比如[Browserify](http://browserify.org/)。

下面这个例子展示如何创建一个只包含了`eventTracker`和`outboundLinkTracker`插件的build：

```sh
browserify lib/plugins/event-tracker lib/plugins/outbound-link-tracker
```

当进行自定义构建的时候，一定保证更新跟踪代码保证只需要引入插件包含在你的构建中。引入一个没有在创建里面的插件将会是一个不满足的依赖，也将会防止运行后续的命令。

如果你已经正在使用模块加载器像[Browserify](http://browserify.org/), [Webpack](https://webpack.github.io/), 或者 [SystemJS](https://github.com/systemjs/systemjs)来建立你的JavaScript，你可以跳过上面的步骤然后只要直接在你的代码文件里面引入在[通过npm加载autotrack](#通过npm加载autotrack)部分描述的插件。

### autotrack多个跟踪器使用

所有的autotrack的插件都支持多个跟踪器的使用，只要通过对`require`命令分别指定跟踪器的名称即可。下面的例子介绍了两个不同的跟踪器但却同时引入不用autotrack插件的情况。

```js
// 创建两个跟踪器，一个叫‘跟踪器1’，另一个叫‘跟踪器2’。
ga('create', 'UA-XXXXX-Y', 'auto', 'tracker1');
ga('create', 'UA-XXXXX-Z', 'auto', 'tracker2');

// 对跟踪器1引入插件。
ga('tracker1.require', 'eventTracker');
ga('tracker1.require', 'socialWidgetTracker');

// 对跟踪器2引入插件。
ga('tracker2.require', 'eventTracker');
ga('tracker2.require', 'outboundLinkTracker');
ga('tracker2.require', 'pageVisibilityTracker');

// 发送启动页面浏览请求给各个跟踪器。
ga('tracker1.send', 'pageview');
ga('tracker2.send', 'pageview');
```

## 浏览器支持

Autotrack在任何浏览器可以没有错误安全地运行，因为特征检测总是与任何潜在不支持的代码一起使用。然而，autotrack将只在跟踪功能支持的浏览器运行。例如，当某个用户使用IE8浏览器时候，媒体查询不会被跟踪到，原因是媒体查询本身就不能支持IE8浏览器。

所有的autotrack插件运行在下面所罗列的浏览器的测试验证结果可以参看[Sauce Labs](https://saucelabs.com/u/autotrack)：

<table>
  <tr>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png" alt="Chrome"><br>
      ✔
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png" alt="Firefox"><br>
      ✔
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png" alt="Safari"><br>
      6+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/master/edge/edge_48x48.png" alt="Edge"><br>
      ✔
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png" alt="Internet Explorer"><br>
      9+
    </td>
    <td align="center">
      <img src="https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png" alt="Opera"><br>
      ✔
    </td>
  </tr>
</table>

## 翻译

下面的翻译来自这个社区的贡献。请注意下面的翻译不是官方所有而且可能会有一些不精准的地方或者过时：

* [日语](https://github.com/nebosuker/autotrack)
* [汉语](https://github.com/stevezhuang/autotrack/blob/master/README.zh.md)

如果你发现翻译有什么问题，请创建或修改到对应的仓库里面去。按照下面的步骤提交你自己的翻译：

1. 建立这个仓库到你的Github。
2. 更新设置启动发issue的功能，参考[allow issues](http://programmers.stackexchange.com/questions/179468/forking-a-repo-on-github-but-allowing-new-issues-on-the-fork)。
3. 移除所有非文档文件。
4. 翻译新的文档或者更新你的翻译。
5. 提交一个pull请求到这个仓库并且在上面的翻译列表加一个你的翻译链接。

Translation by Steve Zhuang, translation license follows autotrack's project license.
