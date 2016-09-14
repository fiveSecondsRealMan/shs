/**
 * webpack 环境配置
 */

import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import htmlPlugin from 'html-webpack-plugin';

/**
 定义开发环境和生产环境路径
**/

const root = path.join(__dirname);
const dev = path.join(root, 'src');
const dist = path.join(root, 'dist');

/**
  定义协议、主机、端口、域名
**/
const protocol = 'http';
const host = 'localhost';
const port = 8080;
const domain = protocol + '://' + host + ':' + port;

/**
  webpack 基础配置
**/

const baseConfig = {
  context: dev,

  entry: 'shs.js',

  output: {
    path: dist,
    filename: '[name].min.js'
  },

  resolve: {
    extensions: ['', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.js/i,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
};

/**
  webpack 开发环境配置
**/

const devConfig = Object.assign({}, baseConfig);

devConfig.output.filename = '[name].js';
devConfig.output.publicPath = domain;
