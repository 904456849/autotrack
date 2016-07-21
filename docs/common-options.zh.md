# 常见选项

许多autotrack插件适用多个不用插件的常见选项。下面带来常见选项的指南：

- [`fieldsObj`](#fieldsobj)
- [`attributePrefix`](#attributeprefix)
- [`hitFilter`](#hitfilter)

## `fieldsObj`

部分autotrack插件通过默认[analytics.js字段值](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference)集来发送请求。这些插件接受一个`fieldsObj`选项，它可以让你自定义每一个插件的值。同时它还允许你设置任何非默认的字段。

这个`fieldsObj`选项是一个`Object`，它的属性可以是任何[analytics.js字段名](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference)，并且它们的值将会用作所有通过这个插件发送的对应字段值。

### 例子

#### `mediaQueryTracker`

这个配置确保所有的事件通过`mediaQueryTracker`这个没有交互事件的事件发送的：

```js
ga('require', 'mediaQueryTracker', {
  definitions: [...],
  fieldsObj: {
    nonInteraction: true
  }
});
```

#### `urlChangeTracker`

这个选项设置了一个[自定义维度](https://support.google.com/analytics/answer/2709828)的索引为1给所有通过`urlChangeTracker`发送的页面请求。这个将允许你区分原始页面浏览和在通过AJAX加载的“虚拟”页面浏览：

```js
ga('require', 'urlChangeTracker', {
  fieldsObj: {
    dimension1: 'virtual'
  }
});
ga('send', 'pageview', {
  dimension1: 'pageload'
});
```

## `attributePrefix`

所有插件发送请求给谷歌分析都是用户在支持声明属性绑定的DOM元素的交互结果（看[`eventTracker`](/docs/plugins/event-tracker.zh.md)插件看它的工作原理）。因此，这些每一个插件都可以接受`attributePrefix`选项来自定义属性的前缀使用。

一般，每个插件用`attributePrefix`的值都是字符串`'ga-'`，但这个值是可以通过预插件（per-plugin basis）来自定义的。

**注意：** 当设定相同字段在`fieldsObj`选项或者通过DOM元素属性中，这个属性的值将会覆盖`fieldsObj`的值。

### 例子

#### `eventTracker`

```js
ga('require', 'eventTracker', {
  attributePrefix: 'data-'
});
```

```html
<button
  data-on="click"
  data-event-category="Video"
  data-event-action="play">
  Play video
</button>
```

#### `impressionTracker`

```js
ga('require', 'impressionTracker', {
  elements: ['cta'],
  attributePrefix: 'data-ga'
});
```

```html
<div
  id="cta"
  data-ga-event-category="Call to action"
  data-ga-event-action="seen">
  Call to action
</a>
```

#### `outboundLinkTracker`

```js
ga('require', 'outboundLinkTracker', {
  attributePrefix: ''
});
```

```html
<a href="https://example.com" event-category="External Link">Click</a>
```

## `hitFilter`

这个`hitFilter`选项是很有帮助的，它可以让你需要更多高级设置给一个请求或者当你需要完全终止请求。`hitFilter`是一个可以调用跟踪器[model object](https://developers.google.com/analytics/devguides/collection/analyticsjs/model-object-reference)作为第一个参数的函数，并且（如果这个请求是通过DOM元素的用户交互启动的）这个DOM元素可以作为第二个参数。

在这个`hitFilter`函数里面你可以通过在`model`参数中[`get`](https://developers.google.com/analytics/devguides/collection/analyticsjs/model-object-reference#get)方法获取任何模型对象的字段值。你还可以通过在`model`参数中[`set`](https://developers.google.com/analytics/devguides/collection/analyticsjs/model-object-reference#set)方法设置一个新的值。终止这个请求还可以抛出一个错误。

仅仅为了当前的请求（不是所有的随后请求）修改模型，，确保给第三个参数([`temporary`](https://developers.google.com/analytics/devguides/collection/analyticsjs/model-object-reference#set))设置`true`。

### 工作原理

这个`hitFilter`选项是用来重写跟踪器的[`buildHitTask`](https://developers.google.com/analytics/devguides/collection/analyticsjs/tasks)。通过`hitFilter`的函数运行在`fieldsObj`值后边，并且属性字段已经被设置在跟踪器中，但需要在之前运行原先的`buildHitTask`。想知道更多请参考[analytics.js tasks](https://developers.google.com/analytics/devguides/collection/analyticsjs/tasks)。

### 例子

#### `pageVisibilityTracker`

这个配置设置自定义维度1给被设置`visibilitychange`事件请求的任何`eventValue`字段。它分配了`true`给第三个参数`set`方法，传给`set`方法，所有这个改变只会影响当前的请求：
```js
ga('require', 'pageVisibilityTracker', {
  hitFilter: function(model) {
    model.set('dimension1', String(model.get('eventValue')), true);
  }
});
```

#### `impressionTracker`

这个配置防止将请求发送到包含`is-invisible`类的元素的展示。

```js
ga('require', 'impressionTracker', {
  hitFilter: function(model, element) {
    if (element.className.indexOf('is-invisible') > -1) {
      throw new Error('Aborting hit');
    }
  }
});
```
