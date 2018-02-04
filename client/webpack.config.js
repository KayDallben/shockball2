var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './src/index.js',
     output: {
         path: path.resolve(__dirname, '../public'),
         filename: 'app.bundle.js'
     },
     devtool: 'inline-source-map',
     devServer: {
      contentBase: '../public',
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };