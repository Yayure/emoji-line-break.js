English | [简体中文](./README.ZH-CN.md)

# emoji-line-break.js
[![Build Status](https://travis-ci.com/Yayure/emoji-line-break.js.svg?branch=master)](https://travis-ci.com/Yayure/emoji-line-break.js) [![npm](https://img.shields.io/npm/v/emoji-line-break)](https://www.npmjs.com/package/emoji-line-break)

Split emoji string into an array. The purpose is to solve the problem of line wrapping drawn on Canvas with emoji string. ([demo](https://yayure.github.io/emoji-line-break.js))

## Installation
### Nodejs
```shell
npm install emoji-line-break
```
```javascript
var emojiLineBreak = require('emoji-line-break');
```
>You should **disable @babel/plugin-transform-unicode-regex** if you use babel to convert es6 to es5. ([e.g](./webpack.config.js#L42))

### Browser
You can use this smaller version if you can provide the [canvas2d](#canvas2d-optional). (`size~14.6kb`)
```html
<script src="https://cdn.jsdelivr.net/npm/emoji-line-break@1.1.0/dist/emoji-line-break.canvas2d.min.js"></script>
```

Full ver. (`size~62.7kb`)
```html
<script src="https://cdn.jsdelivr.net/npm/emoji-line-break@1.1.0/dist/emoji-line-break.min.js"></script>
```

## Usage
### Syntax
```javascript
emojiLineBreak(text[, options]);
```

- **text**
  - Type: `String`
  - The string to be split.
- **options** (optional)
  - Type: `Object`
  - Split string configuration. Check out the available [options](#options).

### Examples
```javascript
var text = `Lorem ipsum dolor sit amet,☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕

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
output:
```javascript
result: [
  'Lorem ipsum dolor sit amet,☕☕☕☕☕☕☕☕☕☕☕☕',
  '☕☕☕☕☕☕☕☕☕☕☕☕☕',
  '',
  'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ',
  'commodo consequat.'
]
```

### Options

#### canvas2d (optional)
- Type: `CanvasRenderingContext2D`
- Default: `null`

In an environment that supports `Canvas`, you can provide the [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) to **support all languages**, improve line break precision and customize the values of [fontWeight](#fontweight-optional) and [fontFamily](#fontfamily-optional).
>You must pass in the CanvasRenderingContext2D if you use the smaller version.

#### lang (optional)
- Type: `String`
- Default: `en`
- Options:
  - `en`: Matches and calculates 26 English uppercase, lowercase letters and basic English punctuation in the split string(**text**).
  - `zh`: Matches and calculates Chinese, Chinese basic punctuation characters, 26 English uppercase, lowercase letters and English basic punctuation characters in the split string(**text**).

Set the language used.
>This option will be invalid when the [canvas2d](#canvas2d-optional) option is provided.

#### wordBreak (optional)
- Type: `String`
- Default: `break-word`
- Options:
  - `break-all`: To prevent overflow, word breaks should be inserted between any two characters.
  - `break-word`: To prevent overflow, word breaks should be inserted between any two words.(All characters before any space are counted as a single word)

Specify how to break lines within words.

#### fontWeight (optional)
- Type: `String`
- Default: `normal`
- Options:
  - `lighter`: Lighter font weight.
  - `normal`: Normal font weight.
  - `bold`: Bold font weight.

Set the font weight.
>This option supports custom values when the [canvas2d](#canvas2d-optional) option is provided.

#### fontFamily (optional)
- Type: `String`
- Default: `sans-serif`
- Options:
  - `serif`: **serif** font family.
  - `sans-serif`: **sans-serif** font family.
  - `Arial`: **Arial** font family.
  - ` cursive`: **cursive** font family.

Set the font family.
>This option supports custom values when the [canvas2d](#canvas2d-optional) option is provided.

#### fontSize (optional)
- Type: `String|Number`
- Default: `16px`

Set the font size, only supports `px`.

#### width (optional)
- Type: `String|Number`
- Default: `500px`

Set the width of the text container, only supports `px`.


## License

[MIT](https://github.com/Yayure/emoji-line-break.js/blob/master/LICENSE)
