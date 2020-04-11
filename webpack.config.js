const path = require('path');
const webpack = require('webpack');
const createBanner = require('create-banner');

module.exports = (env) => {
    let entry = './src/index.js';
    let filename = 'emoji-line-break.min.js';

    if (env && env.is_canvas2d) {
        entry = './src/index.canvas2d.js';
        filename = 'emoji-line-break.canvas2d.min.js';
    }

    return {
        mode: 'production',
        entry: entry,

        output: {
            filename: filename,
            path: path.resolve(__dirname, 'dist'),
            library: 'emojiLineBreak',
            globalObject: 'this',
            libraryTarget: 'umd'
        },

        plugins: [new webpack.BannerPlugin({
            banner: createBanner(),
            raw: true
        })],

        module: {
            rules: [
                {
                    test: /.js$/,
                    loader: 'babel-loader',

                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    exclude: ['@babel/plugin-transform-unicode-regex']
                                }
                            ]
                        ]
                    }
                }
            ]
        }
    };
}
