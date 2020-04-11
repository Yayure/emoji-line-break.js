"use strict";

const emojiRegex = require('emoji-regex/es2015/index.js');
const KMAP = require('./keymap.js');
const emojiLineBreakCanvas2d = require('./index.canvas2d.js');

let unitBaseZH = null;
let exactRegexZH = null;
let unitBaseEN = null;
let exactRegexEN = null;

if ((typeof window !== 'undefined' && /Mobile/img.test(window.navigator.appVersion) && !/win|mac/img.test(window.navigator.platform))
    || (typeof wx !== 'undefined' && wx.getSystemInfoSync && /android|ios/img.test(wx.getSystemInfoSync().platform))) {
    /** moblie */
    unitBaseZH = require('./unit-base.mobile.zh.common.js');
    exactRegexZH = require('./exact-regex.mobile.zh.common.js');
    unitBaseEN = require('./unit-base.mobile.en.common.js');
    exactRegexEN = require('./exact-regex.mobile.en.common.js');
} else {
    /** pc, node or other */
    unitBaseZH = require('./unit-base.zh.common.js');
    exactRegexZH = require('./exact-regex.zh.common.js');
    unitBaseEN = require('./unit-base.en.common.js');
    exactRegexEN = require('./exact-regex.en.common.js');
}

let now = new Date();
let jetLag = now.getHours() - now.getUTCHours();
let lang = (jetLag === 8 || jetLag === -16) ? 'zh' : 'en';

const i18n = {
    zh: {
        fontSize: '16px',
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
        wordBreak: 'break-all',
        width: '500px',
        unitBase: null,
        emojiRegex: null,
        mainRegex: null,
        mainRegexBW: null,
        exactRegex: null,
        source: {
            unitBase: unitBaseZH,
            exactRegex: exactRegexZH,
        }
    },
    en: {
        fontSize: '16px',
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
        wordBreak: 'break-word',
        width: '500px',
        unitBase: null,
        emojiRegex: null,
        mainRegex: null,
        mainRegexBW: null,
        exactRegex: null,
        source: {
            unitBase: unitBaseEN,
            exactRegex: exactRegexEN,
        }
    }
}

function linesBreakWord(text, langOpt) {
    let lines = [];
    let index = 0;
    let unitBase = langOpt.unitBase;
    let baseW = unitBase[KMAP.baseWidth] + (parseFloat(langOpt.fontSize) - parseFloat(unitBase[KMAP.fontSize])) * unitBase[KMAP.offset];
    let maxW = parseInt(langOpt.width);

    text.replace(langOpt.mainRegexBW, (p1) => {
        !lines[index] && (lines[index] = { text: '', length: 0 });

        let exactRatio = 1;
        let countStr = p1;
       
        if (/\n|\r/.test(p1)) {
            ++index
            return ''
        }

        if (langOpt.emojiRegex.test(p1)) {
            let curW = baseW;
            countStr.replace(langOpt.mainRegex, (p2) => {
                if (langOpt.exactRegex.some(el => {exactRatio = el[KMAP.ratio]; return el[KMAP.regex].test(p2); })) {
                    curW = baseW * exactRatio;
                } else if (langOpt.emojiRegex.test(p2)) {
                    curW = unitBase[KMAP.emojiRatio] * baseW;
                } else if (encodeURIComponent(p2) === '%E2%80%8B') {
                    p2 = '';
                    curW = 0;
                } else {
                    curW = baseW;
                }

                let lineWidth = curW + lines[index].length;
                if (lineWidth > maxW) {
                    ++index;
                    lines[index] = { text: p2, length: curW };
                } else {
                    lines[index].text += p2;
                    lines[index].length = lineWidth;
                }

                return ''
            })
        } else {
            let wordW = 0;
            let spaceW = 0;
            countStr.replace(langOpt.mainRegex, (p2) => {
                if (langOpt.exactRegex.some(el => { exactRatio = el[KMAP.ratio]; return el[KMAP.regex].test(p2); })) {
                    if (p2 === ' ') {
                        spaceW = baseW * exactRatio;
                    }
                    wordW += (baseW * exactRatio);
                } else {
                    wordW += baseW;
                }
                return ''
            })

            if (wordW - spaceW > maxW) {
                let curW = baseW;
                countStr.replace(langOpt.mainRegex, (p2) => {
                    if (langOpt.exactRegex.some(el => { exactRatio = el[KMAP.ratio]; return el[KMAP.regex].test(p2); })) {
                        curW = baseW * exactRatio;
                    } else if (encodeURIComponent(p2) === '%E2%80%8B') {
                        p2 = '';
                        curW = 0;
                    } else {
                        curW = baseW;
                    }

                    let lineWidth = curW + lines[index].length;
                    if (lineWidth > maxW) {
                        ++index;
                        lines[index] = {text: p2, length: curW};
                    } else {
                        lines[index].text += p2;
                        lines[index].length = lineWidth;
                    }

                    return ''
                })
            } else {
                let lineWidth = wordW + lines[index].length;
                if (lineWidth - spaceW > maxW) {
                    ++index;
                    lines[index] = {text: p1, length: wordW};
                } else {
                    lines[index].text += p1;
                    lines[index].length = lineWidth;
                }
            }
        }

        return ''
    });

    return lines.map(item => item.text);
}

function linesBreakAll(text, langOpt) {
    let lines = [];
    let index = 0;
    let unitBase = langOpt.unitBase;
    let baseW = unitBase[KMAP.baseWidth] + (parseFloat(langOpt.fontSize) - parseFloat(unitBase[KMAP.fontSize])) * unitBase[KMAP.offset];
    let maxW = parseInt(langOpt.width);

    text.replace(langOpt.mainRegex, (p1) => {
        !lines[index] && (lines[index] = { text: '', length: 0 });

        let exactRatio = 1;
        let curW = baseW;
        
        if (/\n|\r/.test(p1)) {
            ++index
            return ''
        } else if (langOpt.exactRegex.some(el => { exactRatio = el[KMAP.ratio]; return el[KMAP.regex].test(p1); })) {
            curW = baseW * exactRatio;
        } else if (langOpt.emojiRegex.test(p1)) {
            curW = unitBase[KMAP.emojiRatio] * baseW;
        } else if (encodeURIComponent(p1) === '%E2%80%8B') {
            p1 = '';
            curW = 0;
        }

        let lineWidth = curW + lines[index].length;

        if (lineWidth > maxW) {
            ++index;
            lines[index] = { text: p1, length: curW };
        } else {
            lines[index].text += p1;
            lines[index].length = lineWidth;
        }

        return ''
    });

    return lines.map(item => item.text);
}

module.exports = function (text, options) {
    if (text === undefined) return [];

    /** 传入canvas的情况 */
    if (options && (options.canvas2d && typeof options.canvas2d.measureText !== 'undefined' || options.canvas2d === null)) {
        if (options.canvas2d !== null) {
            return emojiLineBreakCanvas2d(text, options);
        }
    }

    /** 未传入canvas的情况 */
    if (typeof text === 'object' && !Array.isArray(options)) {
        options = text;
        text = '';
    }

    let is_options = typeof options === 'object';
    let langOpt = i18n[is_options && options.lang || lang];
    // 初始化基础    
    if (is_options) {
        options.fontSize && (langOpt.fontSize = options.fontSize);

        options.width && (langOpt.width = options.width);
        options.wordBreak && (langOpt.wordBreak = options.wordBreak);
        
        // 参数校验
        if (options.fontWeight && langOpt.source.unitBase[KMAP[options.fontWeight]] === undefined) {
            console.error('Please enter a legal fontWeight. (lighter, normal or bold)')
            return
        }
        if (options.fontFamily && langOpt.source.unitBase[KMAP[langOpt.fontWeight]][KMAP[options.fontFamily]] === undefined) {
            console.error('Please enter a legal fontFamily. (serif, sans-serif, Arial or cursive)')
            return
        }
    }

    // 初始化基础单位及精确表达式
    if ((is_options && (options.fontWeight && options.fontWeight !== langOpt.fontWeight || 
        options.fontFamily && options.fontFamily !== langOpt.fontFamily)) || !langOpt.exactRegex) {
        if (is_options) {
            options.fontFamily && (langOpt.fontFamily = options.fontFamily);
            options.fontWeight && (langOpt.fontWeight = options.fontWeight);
        }

        langOpt.unitBase = langOpt.source.unitBase[KMAP[langOpt.fontWeight]][KMAP[langOpt.fontFamily]];

        let sourceExact = langOpt.source.exactRegex[KMAP[langOpt.fontWeight]][KMAP[langOpt.fontFamily]];
        // langOpt.exactRegex = sourceExact.map(item => item[KMAP.regex] = new RegExp(item[KMAP.regex]));
        langOpt.exactRegex = [];
        sourceExact.forEach(item => {
            let _nitem = {};
            _nitem[KMAP.ratio] = item[KMAP.ratio];
            _nitem[KMAP.regex] = new RegExp(item[KMAP.regex]);
            langOpt.exactRegex.push(_nitem);
        })
    }

    // 初始化字符串匹配正则及emoji正则
    // if ((is_options && options.emojiRegex) || !langOpt.mainRegex) {
    if (!langOpt.mainRegex) {
        let emjDfStr = emojiRegex().toString();
        let mRegStr = /^\/(.*)\/[imgu]*$/.exec(emjDfStr)[1] || '';

        langOpt.emojiRegex = new RegExp(mRegStr, 'u');
        
        let mRegStrBW = `${mRegStr}|\\n|\\r|[^ \n\r-]+(-| |$)`;

        langOpt.mainRegex = new RegExp(`(${mRegStr}|\\n|\\r|.)`, 'gmu');
        langOpt.mainRegexBW = new RegExp(`(${mRegStrBW}|.)`, 'gmu');
    }

    if (langOpt.wordBreak === 'break-word') {
        return linesBreakWord(text, langOpt)
    } else {
        return linesBreakAll(text, langOpt)
    }
}
