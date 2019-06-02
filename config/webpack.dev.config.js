'use strict'
process.env.NODE_ENV = "development"
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require("./config")
module.exports = {
	mode: process.env.NODE_ENV,
	entry:config.dev.entry,
	output:{
		filename: config.dev.filename,
		path:config.dev.path,
	},
	plugins: [
		new HtmlWebpackPlugin({
				filename: './fadeIn.html',
				template: './fadeIn.html',
				inject: true,
			}),
		new HtmlWebpackPlugin({
				filename: './tbslide.html',
				template: './tbslide.html',
				inject: true,
			}),
		new HtmlWebpackPlugin({
				filename: './lrslide.html',
				template: './lrslide.html',
				inject: true,
			}),
		new FriendlyErrorsWebpackPlugin({
			 compilationSuccessInfo: {
				messages: [`You application is running here http://localhost:${config.dev.port}`],
			  },
		}),
		new CopyWebpackPlugin([
		  {
		    from: path.resolve(__dirname, './../static'),
		    to: path.resolve(__dirname, './../dist/static'),
		    ignore: ['.*']
		  }
		]),
	],
	devServer: {
	  contentBase: config.dev.contentBase,
	  compress: true,
	  overlay: true, // 编译出现错误时，将错误直接显示在页面上
	  quiet: true,
	  port: config.dev.port,
	  proxy:config.dev.proxyTable,
	  disableHostCheck: true
	}
}