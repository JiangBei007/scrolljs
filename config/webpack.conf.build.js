const path = require('path')

module.exports = {
	mode: "production",
	entry:path.resolve(__dirname, './../src/main.js'),
	output:{
		filename:'bundle.js',
		path: path.resolve(__dirname, './../dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
				  loader: 'babel-loader',
				  options: {
					presets: ['env']
				  }
				}
			},
		]
	},
	resolve:{
		
	},
	plugins: [
		
	]
}