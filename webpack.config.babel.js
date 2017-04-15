import path from 'path';
import { Dir } from './src/config';

const Config = {
  entry: [
    'babel-polyfill',
    path.join(Dir.src, 'client.jsx'),
  ],
  output: {
    path: path.join(Dir.public, 'build'),
    filename: 'app.js',
  },
  resolve: {
    modules: [Dir.src, "node_modules"],
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }],
  },
};

export default Config;
