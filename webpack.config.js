const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname,'public/build'),
		filename: 'bundle.js'
	},
	// mode: 'production',
	module: {
		rules: [
		  {
			test: /\.css$/i,
			use: ["style-loader", "css-loader", "postcss-loader"],
		  },
		],
	  },
}
