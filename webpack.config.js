/**
 * webpack 环境配置
 */

import path from 'path';
import webpack from 'webpack';

const dev = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

/**
  webpack 基础配置
**/

const baseConfig = {
  context: dev,

  entry: {
    shs: './shs.js'
  },

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

const distConfig = Object.assign({}, baseConfig);
const plugins = distConfig.plugins || (distConfig.plugins = []);

plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: true
    }
  }),

  new webpack.NoErrorsPlugin()
);


webpack(distConfig, (err, stat) => {
  console.log(stat.toString());
})
