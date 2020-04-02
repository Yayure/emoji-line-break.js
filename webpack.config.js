const path = require('path');
const webpack = require('webpack');
const createBanner = require('create-banner');

module.exports = {
	mode: 'production',
	entry: './index.js',

	output: {
		filename: `emoji-line-break.min.js`,
		path: path.resolve(__dirname, 'dist'),
		library: 'emojiLineBreak',
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
							'@babel/preset-env'
						]
					]
				}
			}
		]
	}
};
