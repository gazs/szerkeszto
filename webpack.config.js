module.exports = {
  entry: {
    app: ["./zako.js"]
  },
  output: {
    path: "./build",
    publicPath: "/",
    filename: "bundle.js"
  },
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
			{ test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader"}
		]
	}
};
