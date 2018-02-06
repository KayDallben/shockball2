var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
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
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            url: false,
            sourceMap: true
          }
        }, {
          loader: 'less-loader',
          options: {
            relativeUrls: false,
            sourceMap: true
          }
        }]
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin([{
      from: 'src/img',
      to: 'img'
    }, {
      from: 'src/docs',
      to: 'docs'
    }, {
      from: 'src/authorize',
      to: 'authorize'
    }, {
      from: 'src/index.html'
    }])
  ]
};
