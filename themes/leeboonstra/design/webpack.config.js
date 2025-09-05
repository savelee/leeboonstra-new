const path = require('path');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//var extractPlugin = new ExtractTextPlugin({
//   filename: 'main.css'
//});

module.exports = {
	mode: 'production',
	entry: './src/js/index.js',
	devServer: {
		contentBase: path.join(__dirname, '../source'),
		compress: true,
		port: 9000
	  },
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
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
			use: [
				MiniCssExtractPlugin.loader,
				{
				  loader: "css-loader",
				  options: {
					url: false
				  }
				},
				{
				  loader: "postcss-loader"
				},
				{
				  loader: "sass-loader"
				}]
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
	optimization: {
	minimizer: [
		new CssMinimizerPlugin({
			minimizerOptions: {
				preset: ['default', { discardComments: { removeAll: true } }],
			}
		})
	],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "main.css"
		}),
		new MinifyPlugin()
	]
};