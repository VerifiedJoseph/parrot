const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  let cspValue = ''

  if (argv.mode === 'production') {
    cspValue = "default-src 'self' blob:; base-uri 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; upgrade-insecure-requests; block-all-mixed-content;"
  }

  return {
    entry: './src/index.js',
    mode: 'development',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, './dist'),
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          include: path.resolve(__dirname, './src'),
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: 'Parrot',
        description: 'Viewer for tweet archives created with the Twitter Media Downloader',
        favicon: './src/assets/images/favicon.ico',
        template: './src/assets/index.html',
        meta: {
          'Content-Security-Policy': {
            'http-equiv': 'Content-Security-Policy',
            content: cspValue
          }
        },
        inject: true
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 9000
    }
  }
}
