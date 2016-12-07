/* global process, __dirname, require, module */
'use strict';

const path = require('path');
const webpack = require('webpack');

const dev = !(process.argv.indexOf('--env=prod') !== -1);
console.log( (dev ? 'development' : 'production') );

module.exports =
{
  entry:
  {
    app: './client-src/app.js'
  },
  output:
  {
    path: __dirname + '/public/build/',
    filename: '[name].min.js',
    library: '[name]'
  },
  resolve:
  {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.html'],
  },
  watch: dev,
  devtool: dev ? 'source-map' : null,
  module:
  {
    loaders:
    [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query:
        {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.html$/,
        name: 'mandrillTemplates',
        loader: 'raw!html-minify'
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline'
      // },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
    ]
  },
  'html-minify-loader':
  {
    empty: false,        // KEEP empty attributes
    cdata: true,        // KEEP CDATA from scripts
    comments: false,     // KEEP comments
    dom:
    {                            // options of !(htmlparser2)[https://github.com/fb55/htmlparser2]
      lowerCaseAttributeNames: false,      // do not call .toLowerCase for each attribute name (Angular2 use camelCase attributes)
    }
  },
  plugins: dev
      ? []
      : [
        new webpack.DefinePlugin({
          'process.env':
          {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          mangle: true,
          sourcemap: false,
          compress:
          {
            warnings: false,
            dead_code: true,
            drop_debugger: true,
            conditionals: true,
            unused: true,
            drop_console: true
          }
        })
      ],
};