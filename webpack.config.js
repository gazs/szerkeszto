var Webpack = require('webpack');
module.exports = {
  entry: {
    app: "./main.js",
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
			{ test: /\.pegjs$/, exclude: /node_modules/, loader: "pegjs-loader"},
			{ test: /\.ohm$/, exclude: /node_modules/, loader: "ohm-loader"}
		]
	},
	plugins: [new Webpack.HotModuleReplacementPlugin()]
};
