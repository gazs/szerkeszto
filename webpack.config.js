var Webpack = require('webpack');
module.exports = {
  entry: {
    app: "./main.js",
		adjust: "./adjust.js",
		editor: "./editor.js"
  },
  output: {
    path: "./build",
    publicPath: "/build/",
    filename: "[name]bundle.js"
  },
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
			{ test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader"},
			{ test: /\.pegjs$/, exclude: /node_modules/, loader: "pegjs-loader"}
		]
	},
	plugins: [new Webpack.HotModuleReplacementPlugin()]
};
