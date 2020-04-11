"use strict";

const emojiRegex = require('emoji-regex/es2015/index.js');

let now = new Date();
let jetLag = now.getHours() - now.getUTCHours();
let lang = (jetLag === 8 || jetLag === -16) ? 'zh' : 'en';

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

module.exports = function(text, options) {
    if (text === undefined) return [];

    options && options.canvas2d && typeof options.canvas2d.measureText !== 'undefined' && (supportCanvasOpt.canvas2d = options.canvas2d);
    /** set null to clear original canvas2d */
    options && options.canvas2d === null && (supportCanvasOpt.canvas2d = null);

    if (supportCanvasOpt.canvas2d !== null && !supportCanvasOpt.canvas2d) {
        console.error('You must set the canvas2d option!');
        return
    }

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
            return linesBreakAllCtx(text, options)
        }
    }
}