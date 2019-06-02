'use strict'

const path = require('path')

module.exports = {
	dev: {
		entry:path.resolve(__dirname, './../src/main.js'),
		filename: 'bundle.js',
		path: path.resolve(__dirname, './../dist'),
		contentBase: path.join(__dirname, "./../dist"),
		port: 9800,
			proxyTable: {
				'/api': {
					target: '127.0.0.1:7001',
					ws: true,
					changeOrigin: true
				},
		},
    host: 'localhost', // can be overwritten by process.env.HOST
  },
  build: {
	entry:path.resolve(__dirname, './../src/main.js'),
    filename: 'static/js/bundle.js',
    path: path.resolve(__dirname, './../dist'),
    publicPath:"./"
  }
}
		