const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractPlugin = new ExtractTextPlugin({
   filename: 'main.css'
});

module.exports = {
	entry: './src/js/index.js',
	devServer: {
		contentBase: path.join(__dirname, '../source'),
		compress: true,
		port: 9000
	  },
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../source')
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		},
		{
			test: /\.scss$/,
			use: extractPlugin.extract({
				use: ['css-loader', 'resolve-url-loader', 'sass-loader']
			})
		},
		{
			test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			use: [
			  {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'fonts/',
					esModule: false
				}
			  }
			]
		}
	]
	},
	plugins: [
		extractPlugin
	]
};