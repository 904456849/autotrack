# 升级指南

这个指南概述了如果将任意1.0的预版本到1.0正式版本的升级介绍。

## 重大更改

### 全局更改

在1.0版本，你再也不能使用`ga('require', 'autotrack')`命令来加载所有的插件。这个更改是为了避免用户不小心启用了它们原本不准备使用的插件。

而且，所有自动跟踪的插件都必须单独加载，包括它们的选项设置也是单独指定。

```html
<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');

// 插件必须独立加载。
ga('require', 'eventTracker');
ga('require', 'outboundLinkTracker');
ga('require', 'urlChangeTracker');
// ...

ga('send', 'pageview');
</script>
<script async src="https://www.google-analytics.com/analytics.js"></script>
<script async src="path/to/autotrack.js"></script>
```

在所有的1.x版本中，如果加载`autotrack`后会在控制台体现出一个警报。在2.0版本，警告不会出现。

### 独立插件更改

#### [`mediaQueryTracker`](/docs/plugins/media-query-tracker.md)

- 将选项`mediaQueryDefinitions`改名为`definitions`。
- 将选项`mediaQueryChangeTemplate`改名为`changeTemplate`。
- 将选项`mediaQueryChangeTimeout`改名为`changeTimeout`。

#### `socialTracker`

- 插件`socialTracker`被更名为[`socialWidgetTracker`](/docs/plugins/social-widget-tracker.zh.md)并且不再支持声明社交行为的跟踪（因为完全可以通过[`eventTracker`](/docs/plugins/event-tracker.zh.md)插件搞定）。

## 插件增强

### 全局增强

- All plugins that send hits accept both [`fieldsObj`](/docs/common-options.md#fieldsobj) and [`hitFilter`](/docs/common-options.md#hitfilter) options. These options can be used to set or change any valid analytics.js field prior to the hit being sent.
- All plugins that send hits as a result of user interaction with a DOM element support [setting field values declaratively](/docs/common-options.md#attributeprefix).

### 独立插件增强

#### [`eventTracker`](/docs/plugins/event-tracker.md)

- 添加对任何DOM事件声明跟踪的支持，不单单只是点击事件（比如`submit`， `contextmenu`等）

#### [`outboundFormTracker`](/docs/plugins/outbound-form-tracker.md)

- 添加对跟踪在shadow DOM子树下的表单支持。
- 添加对用来自定义识别表单的选择器的功能。
- 添加一个`parseUrl`函数在`shouldTrackOutboundForm`方法里，方便更简单地识别或排除导出表单。

#### [`outboundLinkTracker`](/docs/plugins/outbound-link-tracker.md)

- 添加对DOM事件的支持，不仅是点击事件（比如`contextmenu`， `touchend`等）
- 添加对跟踪在shadow DOM子树下的链接支持。
- 添加对用来自定义识别链接的选择器的功能。
- 添加一个`parseUrl`函数在`shouldTrackOutboundLink`方法里，方便更简单地识别或排除导出链接。

## 新插件

添加了下面新的几个插件。为了解详细用途请参看它们各自的文档页面。

- [`cleanUrlTracker`](/docs/plugins/clean-url-tracker.zh.md)
- [`impressionTracker`](/docs/plugins/impression-tracker.zh.md)
- [`pageVisibilityTracker`](/docs/plugins/page-visibility-tracker.zh.md)
