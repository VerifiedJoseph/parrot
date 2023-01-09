const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim()

module.exports = (env, argv) => {
  let csp = ''
  let zipDownloadPath = 'parrot-tweet-viewer.zip'

  if (argv.mode === 'production') {
    csp = "default-src 'self' blob:; base-uri 'self'; style-src 'self'; script-src 'self'; upgrade-insecure-requests; block-all-mixed-content;"
    zipDownloadPath = 'https://verifiedjoseph.github.io/parrot/parrot-tweet-viewer.zip'
  }

  return {
    entry: './src/js/page/index.js',
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
    optimization: {
      minimizer: [
        '...',
        new CssMinimizerPlugin()
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'app.css'
      }),
      new HtmlWebpackPlugin({
        title: 'Parrot',
        description: 'Viewer for tweet archives created with the Twitter Media Downloader',
        favicon: './src/images/favicon.ico',
        template: './src/index.html',
        gitCommitHash: commitHash,
        gitCommitUrl: `https://github.com/VerifiedJoseph/parrot/commit/${commitHash}`,
        zipDownloadUrl: zipDownloadPath,
        version: process.env.PARROT_VERSION || 'dev',
        meta: {
          'Content-Security-Policy': {
            'http-equiv': 'Content-Security-Policy',
            content: csp
          }
        },
        inject: 'body'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 9000
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
}
