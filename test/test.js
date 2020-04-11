const assert = require('assert');
const emojiLineBreak = require('../dist/emoji-line-break.min.js');

describe('emojiLineBreak', function() {

    // test zh
    describe('***zh***', function() {
        let text = '雪风大人纳诺达~雪风大人纳诺达~☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕';
        let result = ['雪风大人纳诺达~雪风大人纳诺达~☕☕☕☕☕☕☕☕☕☕☕', '☕☕☕☕☕'];

        describe(`#emojiLineBreak('${text}')`, function() {
            it(`should return value`, function() {
                assert.equal(typeof emojiLineBreak(text), typeof result);
            });
        });
        
        describe(`#emojiLineBreak('${text}', {
            lang: 'zh'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'zh',
            wordBreak: 'break-all'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh',
                    wordBreak: 'break-all'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'zh',
            fontWeight: 'normal'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh',
                    fontWeight: 'normal'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'zh',
            fontFamily: 'sans-serif'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh',
                    fontFamily: 'sans-serif'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'zh',
            fontSize: '16px'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh',
                    fontSize: '16px'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'zh',
            width: '500px'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh',
                    width: '500px'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'zh',
            wordBreak: 'break-all',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: '16px',
            width: '500px'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'zh',
                    wordBreak: 'break-all',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: '16px',
                    width: '500px'
                }), result);
            });
        });
    })


    // test en
    describe('***en***', function() {
        let text = 'orem ipsum dolor sit amet☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕☕';
        let result = ['orem ipsum dolor sit amet☕☕☕☕☕☕☕☕☕☕☕☕☕', '☕☕☕'];

        describe(`#emojiLineBreak('${text}')`, function() {
            it(`should return value`, function() {
                assert.equal(typeof emojiLineBreak(text), typeof result);
            });
        });
        
        describe(`#emojiLineBreak('${text}', {
            lang: 'en'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'en',
            wordBreak: 'break-word'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en',
                    wordBreak: 'break-word'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'en',
            fontWeight: 'normal'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en',
                    fontWeight: 'normal'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'en',
            fontFamily: 'sans-serif'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en',
                    fontFamily: 'sans-serif'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'en',
            fontSize: '16px'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en',
                    fontSize: '16px'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'en',
            width: '500px'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en',
                    width: '500px'
                }), result);
            });
        });

        describe(`#emojiLineBreak('${text}', {
            lang: 'en',
            wordBreak: 'break-word',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: '16px',
            width: '500px'
        })`, function() {
            it(`should return ${JSON.stringify(result)}`, function() {
                assert.deepEqual(emojiLineBreak(text, {
                    lang: 'en',
                    wordBreak: 'break-word',
                    fontWeight: 'normal',
                    fontFamily: 'sans-serif',
                    fontSize: '16px',
                    width: '500px'
                }), result);
            });
        });
    })
})