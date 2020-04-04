"use strict";

const emojiRegex = require('emoji-regex/es2015/index.js');

const unitBaseZH = require('./src/unit-base.zh.common.js');
const exactRegexZH = require('./src/exact-regex.zh.common.js');
const unitBaseEN = require('./src/unit-base.en.common.js');
const exactRegexEN = require('./src/exact-regex.en.common.js');

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
    let result = [];
    let lines = [];
    let index = 0;
    let unitBase = langOpt.unitBase;
    let baseW = unitBase.baseWidth + (parseFloat(langOpt.fontSize) - parseFloat(unitBase.fontSize)) * unitBase.offset;
    let maxW = parseInt(langOpt.width);

    text.replace(langOpt.mainRegexBW, (p1) => {
        !lines[index] && (lines[index] = {text: '', length: 0});

        let exactRatio = 1;
        let countStr = p1;
       
        if (/\n|\r/.test(p1)) {
            ++index
            return ''
        }

        if (langOpt.emojiRegex.test(p1)) {
            let curW = baseW;
            countStr.replace(langOpt.mainRegex, (p2) => {
                if (langOpt.exactRegex.some(el => {exactRatio = el.ratio; return el.regex.test(p2); })) {
                    curW = baseW * exactRatio;
                } else if (langOpt.emojiRegex.test(p2)) {
                    curW = unitBase.emojiRatio * baseW;
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
            let wordW = 0;
            let spaceW = 0;
            countStr.replace(langOpt.mainRegex, (p2) => {
                if (langOpt.exactRegex.some(el => {exactRatio = el.ratio; return el.regex.test(p2); })) {
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
                    if (langOpt.exactRegex.some(el => {exactRatio = el.ratio; return el.regex.test(p2); })) {
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

    for (let i = 0; i < lines.length; i++) {
        result.push(lines[i].text);
    }

    return result
}


function linesBreakAll(text, langOpt) {
    let result = [];
    let lines = [];
    let index = 0;
    let unitBase = langOpt.unitBase;
    let baseW = unitBase.baseWidth + (parseFloat(langOpt.fontSize) - parseFloat(unitBase.fontSize)) * unitBase.offset;
    let maxW = parseInt(langOpt.width);

    text.replace(langOpt.mainRegex, (p1) => {
        !lines[index] && (lines[index] = {text: '', length: 0});

        let exactRatio = 1;
        let curW = baseW;
        
        if (/\n|\r/.test(p1)) {
            ++index
            return ''
        } else if (langOpt.exactRegex.some(el => {exactRatio = el.ratio; return el.regex.test(p1); })) {
            curW = baseW * exactRatio;
        } else if (langOpt.emojiRegex.test(p1)) {
            curW = unitBase.emojiRatio * baseW;
        } else if (encodeURIComponent(p1) === '%E2%80%8B') {
            p1 = '';
            curW = 0;
        }

        let lineWidth = curW + lines[index].length;

        if (lineWidth > maxW) {
            ++index;
            lines[index] = {text: p1, length: curW};
        } else {
            lines[index].text += p1;
            lines[index].length = lineWidth;
        }

        return ''
    });


    for (let i = 0; i < lines.length; i++) {
        result.push(lines[i].text);
    }

    return result
}

module.exports = function (text, options) {
    if (text === undefined) return [];
    
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
        if (options.fontWeight && langOpt.source.unitBase[options.fontWeight] === undefined) {
            console.error('Please enter a legal fontWeight. (lighter, normal or bold)')
            return
        }
        if (options.fontFamily && langOpt.source.unitBase[langOpt.fontWeight][options.fontFamily] === undefined) {
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

        langOpt.unitBase = langOpt.source.unitBase[langOpt.fontWeight][langOpt.fontFamily];

        let sourceExact= langOpt.source.exactRegex[langOpt.fontWeight][langOpt.fontFamily];
        langOpt.exactRegex = [];
        for (let i = 0; i < sourceExact.length; i++) {
            langOpt.exactRegex.push({
                ratio: sourceExact[i].ratio,
                regex: new RegExp(sourceExact[i].regex) 
            });
        }
    }

    // 初始化字符串匹配正则及emoji正则
    // if ((is_options && options.emojiRegex) || !langOpt.mainRegex) {
    if (!langOpt.mainRegex) {
        let emjDfStr = emojiRegex().toString();
        let regexMatch = /^\/(.*)\/[imgu]*$/;
        let mRegStr = regexMatch.exec(emjDfStr)[1] || '';

        langOpt.emojiRegex = new RegExp(mRegStr, 'u');
        
        let mRegStrBW = mRegStr + `|\\n|\\r|[^ \n\r\-]+( |$)`;

        langOpt.mainRegex = new RegExp(`(${mRegStr}|\\n|\\r|.)`, 'gmu');
        langOpt.mainRegexBW = new RegExp(`(${mRegStrBW}|.)`, 'gmu');
    }

    if (langOpt.wordBreak === 'break-word') {
        return linesBreakWord(text, langOpt)
    } else {
        return linesBreakAll(text, langOpt)
    }
};