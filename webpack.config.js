var Webpack = require('webpack');
module.exports = {
  entry: {
    app: "./main.js",
		editor: "./editor.js",
		vendors: [
			'react',
			'react-dom',
			'react-router',
			'react-redux',
			'./toxi/geom/Vec2D',
			'./toxi/geom/Line2D',
			'./toxi/geom/Ray2D',
			'./toxi/geom/Circle',
			'./toxi/math/mathUtils',
]
  },
  output: {
    path: "./build",
    publicPath: "/",
    filename: "[name]bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
			{ test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader"},
			{ test: /\.pegjs$/, exclude: /node_modules/, loader: "pegjs-loader"},
		]
	},
	plugins: [
		new Webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
	]
};
