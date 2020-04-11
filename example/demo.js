
var emojiLineBreak = require('../src/index.js');


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

/**
result: [
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do ',
  'eiusmod veniam,☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕',
  '☕☕☕☕☕☕☕☕☕',
  '',
  'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ',
  'commodo consequat.'
]
*/