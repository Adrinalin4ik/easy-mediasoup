var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');

 module.exports = {
     entry: "./src",
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015'],
                     plugins: ["transform-object-rest-spread","transform-runtime","transform-object-assign"]
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     plugins: [
	    new webpack.DefinePlugin({ 
	      'process.env': {
	        'NODE_ENV': JSON.stringify('production')
	      }
	    }),
	    new webpack.optimize.DedupePlugin(),
	    new webpack.optimize.UglifyJsPlugin(),
	    new webpack.optimize.AggressiveMergingPlugin(),
	    new CompressionPlugin({ 
	      asset: "[path].gz[query]",
	      algorithm: "gzip",
	      test: /\.js$|\.css$|\.html$/,
	      threshold: 10240,
	      minRatio: 0.8
	    })
	],
    devtool: 'source-map'
 };