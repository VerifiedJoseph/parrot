const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

module.exports = (env, argv) => {
  let csp = ''

  if (argv.mode === 'production') {
    csp = "default-src 'self' blob:; base-uri 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; upgrade-insecure-requests; block-all-mixed-content;"
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
        gitCommitHash: commitHash,
        gitCommitUrl: `https://github.com/VerifiedJoseph/parrot/commit/${commitHash}`,
        meta: {
          'Content-Security-Policy': {
            'http-equiv': 'Content-Security-Policy',
            content: csp
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
