[English](./README.md) | 简体中文

#emoji-line-break.js

将带emoji表情的字符串分割成数组，目的是为了解决带emoji表情字符串在Canvas上绘制的换行问题。（示例参考：[https://yayure.github.io/emoji-line-break.js](https://yayure.github.io/emoji-line-break.js)）

## 安装
### Nodejs
```shell
npm install emoji-line-break
```
```javascript
var emojiLineBreak = require('emoji-line-break');
```

### 浏览器
```html
<script src="./dist/emoji-line-break.min.js"></script>
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
  - 分割字符串的配置。

#### Options

##### lang (可选项)
- Type: `String`
- Default: `zh`
- Options:
  - `en`: 匹配并计算分割字符串中(**text**)的26个英文大小写字母和英文基本标点符号。
  - `zh`: 匹配并计算分割字符串中(**text**)的中文、中文基本标点符号及26个英文大小写字母和英文基本标点符号。

设置使用的语言。

##### wordBreak (可选项)
- Type: `String`
- Default: `break-all`
- Options:
  - `break-all`: 超出容器宽度时在任何字符间分割换行。
  - `break-word`: 超出容器宽度时以单词为单位分割换行(任意空格前的所有字符被计算为单个单词)。

设置字符串超出容器宽度时的换行方式。

##### fontWeight (可选项)
- Type: `String`
- Default: `normal`
- Options:
  - `lighter`: 较细粗细。
  - `normal`: 正常粗细。
  - `bold`: 较粗粗细。

设置字体粗细。

##### fontFamily (可选项)
- Type: `String`
- Default: `sans-serif`
- Options:
  - `serif`: **serif**字体。
  - `sans-serif`: **sans-serif**字体。
  - `Arial`: **Arial**字体。
  - ` cursive`: **cursive**字体。

设置字体。

##### fontSize (可选项)
- Type: `String|Number`
- Default: `16px`

设置字体大小。

##### width (可选项)
- Type: `String|Number`
- Default: `500px`

设置文本容器宽度。

### Examples
```javascript
var text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod veniam,☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕

quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

console.log('result:', emojiLineBreak(text, {
    lang: 'en',
    wordBreak: 'break-word',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: '16px',
    width: '500px'
}));
```
输出:
```javascript
result: [
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do ',
  'eiusmod veniam,☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕',
  '☕☕☕☕☕☕☕☕☕',
  '',
  'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ',
  'commodo consequat.'
]
```

## License

[MIT](https://opensource.org/licenses/MIT)