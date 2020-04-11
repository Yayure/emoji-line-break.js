[English](./README.md) | 简体中文

# emoji-line-break.js
[![Build Status](https://travis-ci.com/Yayure/emoji-line-break.js.svg?branch=master)](https://travis-ci.com/Yayure/emoji-line-break.js) [![npm](https://img.shields.io/npm/v/emoji-line-break)](https://www.npmjs.com/package/emoji-line-break)

将带emoji表情的字符串分割成数组，目的是为了解决带emoji表情字符串在Canvas上绘制的换行问题。（[示例](https://yayure.github.io/emoji-line-break.js)）

## 安装
### Nodejs
```shell
npm install emoji-line-break
```
```javascript
var emojiLineBreak = require('emoji-line-break');
```
>如果您使用babel将es6转换为es5则必须**禁用@babel/plugin-transform-unicode-regex**。（[例如](./webpack.config.js#L32)）

### 浏览器
如果您可以提供[canvas2d](#canvas2d-可选项)，您可以使用这个更小的版本。（`~14.6kb`）
```html
<script src="https://cdn.jsdelivr.net/npm/emoji-line-break@1.1.0/dist/emoji-line-break.canvas2d.min.js"></script>
```

完整版。（`~62.7kb`）
```html
<script src="https://cdn.jsdelivr.net/npm/emoji-line-break@1.1.0/dist/emoji-line-break.min.js"></script>
```

## 用法
### 语法
```javascript
emojiLineBreak(text[, options])
```

- **text**
  - Type: `String`
  - 要分割成数组的字符串。
- **options** (可选项)
  - Type: `Object`
  - 分割字符串的配置。详细配置请参考[options](#options)。

### 示例
```javascript
var text = `无论何时，我们的第一步总是从好奇心开始。

不曾看过的风景，不曾听过的声音，不曾闻过的味道，不曾摸过的质感，不曾尝过的食物，以及不曾感受过的澎湃。

在到达终点的时候，我们会想些什么呢？💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕`;

console.log('result:', emojiLineBreak(text, {
    lang: 'zh',
    wordBreak: 'break-all',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: '16px',
    width: '500px'
}));
```
输出:
```javascript
result: [
  '无论何时，我们的第一步总是从好奇心开始。',
  '',
  '不曾看过的风景，不曾听过的声音，不曾闻过的味道，不曾摸过的质感',
  '，不曾尝过的食物，以及不曾感受过的澎湃。',
  '',
  '在到达终点的时候，我们会想些什么呢？💕💕💕💕💕💕💕💕💕',
  '💕💕💕💕💕💕💕💕💕💕💕'
]
```

### Options

#### canvas2d (可选项)
- Type: `CanvasRenderingContext2D`
- Default: `null`

在支持`Canvas`的环境下您可以提供[CanvasRenderingContext2D](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)以**支持全部语言**以及提升换行精度、自定义[fontWeight](#fontweight-可选项)与[fontFamily](#fontfamily-可选项)的值。
>如果您使用的是更小的版本，则必须要传入CanvasRenderingContext2D。

#### lang (可选项)
- Type: `String`
- Default: `zh`
- Options:
  - `en`: 匹配并计算分割字符串中(**text**)的26个英文大小写字母和英文基本标点符号。
  - `zh`: 匹配并计算分割字符串中(**text**)的中文、中文基本标点符号及26个英文大小写字母和英文基本标点符号。

设置使用的语言。
>当提供[canvas2d](#canvas2d-可选项)选项时此选项会失效。

#### wordBreak (可选项)
- Type: `String`
- Default: `break-all`
- Options:
  - `break-all`: 超出容器宽度时在任何字符间分割换行。
  - `break-word`: 超出容器宽度时以单词为单位分割换行(任意空格前的所有字符被计算为单个单词)。

设置字符串超出容器宽度时的换行方式。

#### fontWeight (可选项)
- Type: `String`
- Default: `normal`
- Options:
  - `lighter`: 较细粗细。
  - `normal`: 正常粗细。
  - `bold`: 较粗粗细。

设置字体粗细。
>当提供[canvas2d](#canvas2d-可选项)选项时此选项可以传入自定义值。

#### fontFamily (可选项)
- Type: `String`
- Default: `sans-serif`
- Options:
  - `serif`: **serif**字体。
  - `sans-serif`: **sans-serif**字体。
  - `Arial`: **Arial**字体。
  - ` cursive`: **cursive**字体。

设置字体。
>当提供[canvas2d](#canvas2d-可选项)选项时此选项可以传入自定义值。

#### fontSize (可选项)
- Type: `String|Number`
- Default: `16px`

设置字体大小，单位只支持`px`。

#### width (可选项)
- Type: `String|Number`
- Default: `500px`

设置文本容器宽度，单位只支持`px`。

## License

[MIT](https://github.com/Yayure/emoji-line-break.js/blob/master/LICENSE)
