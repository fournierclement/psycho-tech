module.exports = {
  entry: './components/Root.jsx',
  output: {
    filename: 'app.js',
    path: './assets'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            'es2015'
          ]
        }
      }
    ]
  }
}
