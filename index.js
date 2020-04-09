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

const supportCanvasOpt = {
    fontSize: '16px',
    fontFamily: 'sans-serif',
    wordBreak: lang === 'en' ? 'break-word' : 'break-all',
    fontWeight: 'normal',
    width: '500px',
    canvas2d: null,
    mainRegex: null,
    mainRegexBW: null,
    emojiRegex: null
}

/** 提供canvas的情况 */
function linesBreakWordCtx(text) {
    let lines = [];
    let index = 0;
    let maxW = parseInt(supportCanvasOpt.width);

    supportCanvasOpt.canvas2d.save();

    supportCanvasOpt.canvas2d.font = `${supportCanvasOpt.fontWeight} ${supportCanvasOpt.fontSize} ${supportCanvasOpt.fontFamily}`;

    text.replace(supportCanvasOpt.mainRegexBW, (p1) => {
        !lines[index] && (lines[index] = { text: '', length: 0 });

        let countStr = p1;
       
        if (/\n|\r/.test(p1)) {
            ++index
            return ''
        }

        if (supportCanvasOpt.emojiRegex.test(p1)) {
            countStr.replace(supportCanvasOpt.mainRegex, (p2) => {
                let curW = supportCanvasOpt.canvas2d.measureText(p2).width;

                if (encodeURIComponent(p2) === '%E2%80%8B') {
                    p2 = '';
                    curW = 0;
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
            let wordW = supportCanvasOpt.canvas2d.measureText(p1).width;
            let spaceW = 0;

            if (/ /.test(p1)) {
                spaceW = supportCanvasOpt.canvas2d.measureText(' ').width;
            }

            if (wordW - spaceW > maxW) {
                countStr.replace(supportCanvasOpt.mainRegex, (p2) => {
                    let curW = supportCanvasOpt.canvas2d.measureText(p2).width;

                    if (encodeURIComponent(p2) === '%E2%80%8B') {
                        p2 = '';
                        curW = 0;
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

    supportCanvasOpt.canvas2d.restore();

    return lines.map(item => item.text);    
}

function linesBreakAllCtx(text) {
    let lines = [];
    let index = 0;
    let maxW = parseInt(supportCanvasOpt.width);

    supportCanvasOpt.canvas2d.save();

    supportCanvasOpt.canvas2d.font = `${supportCanvasOpt.fontWeight} ${supportCanvasOpt.fontSize} ${supportCanvasOpt.fontFamily}`;

    text.replace(supportCanvasOpt.mainRegex, (p1) => {
        !lines[index] && (lines[index] = { text: '', length: 0 });

        let curW = supportCanvasOpt.canvas2d.measureText(p1).width;

        if (/\n|\r/.test(p1)) {
            ++index
            return ''
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

    supportCanvasOpt.canvas2d.restore();

    return lines.map(item => item.text);    
}


/** 不提供canvas的情况 */
function linesBreakWord(text, langOpt) {
    let lines = [];
    let index = 0;
    let unitBase = langOpt.unitBase;
    let baseW = unitBase.baseWidth + (parseFloat(langOpt.fontSize) - parseFloat(unitBase.fontSize)) * unitBase.offset;
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

    return lines.map(item => item.text);
}

function linesBreakAll(text, langOpt) {
    let lines = [];
    let index = 0;
    let unitBase = langOpt.unitBase;
    let baseW = unitBase.baseWidth + (parseFloat(langOpt.fontSize) - parseFloat(unitBase.fontSize)) * unitBase.offset;
    let maxW = parseInt(langOpt.width);

    text.replace(langOpt.mainRegex, (p1) => {
        !lines[index] && (lines[index] = { text: '', length: 0 });

        let exactRatio = 1;
        let curW = baseW;
        
        if (/\n|\r/.test(p1)) {
            ++index
            return ''
        } else if (langOpt.exactRegex.some(el => { exactRatio = el.ratio; return el.regex.test(p1); })) {
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

    return lines.map(item => item.text);
}

module.exports = function (text, options) {
    if (text === undefined) return [];

    /** 传入canvas的情况 */
    options && options.canvas2d && typeof options.canvas2d.measureText !== 'undefined'&& (supportCanvasOpt.canvas2d = options.canvas2d);
    options && options.canvas2d === null && (supportCanvasOpt.canvas2d = null);    //清除原有的ctx
    if (supportCanvasOpt.canvas2d) {
        let emjDfStr = emojiRegex().toString();
        let mRegStr = /^\/(.*)\/[imgu]*$/.exec(emjDfStr)[1] || '';

        supportCanvasOpt.emojiRegex = new RegExp(mRegStr, 'u');

        let mRegStrBW = `${mRegStr}|\\n|\\r|[^ \n\r-]+(-| |$)`;

        options.fontSize && (supportCanvasOpt.fontSize = parseFloat(options.fontSize) + 'px');
        options.fontWeight && (supportCanvasOpt.fontWeight = options.fontWeight);
        options.fontFamily && (supportCanvasOpt.fontFamily = options.fontFamily);
        options.wordBreak && (supportCanvasOpt.wordBreak = options.wordBreak);
        options.width && (supportCanvasOpt.width = options.width);
        
        supportCanvasOpt.mainRegex = new RegExp(`(${mRegStr}|\\n|\\r|.)`, 'gmu');
        supportCanvasOpt.mainRegexBW = new RegExp(`(${mRegStrBW}|.)`, 'gmu');

        if (supportCanvasOpt.wordBreak === 'break-word') {
            return linesBreakWordCtx(text, options);
        } else {
            return linesBreakAllCtx(text, langOpt)
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

        let sourceExact = langOpt.source.exactRegex[langOpt.fontWeight][langOpt.fontFamily];
        langOpt.exactRegex = [];
        sourceExact.forEach(item => {
            langOpt.exactRegex.push({
                ratio: item.ratio,
                regex: new RegExp(item.regex) 
            });
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
