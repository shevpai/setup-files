const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
      splitChunks: {
          chunks: 'all'
      }
  }

  if (isProd) {
      config.minimizer = [
          new OptimizeCssAssetWebpackPlugin(),
          new TerserWebpackPlugin()
      ]
  } 
  return config;  
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
  const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true
        }
    }, 
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}


module.exports = {
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './src/index.jsx']
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: filename('js')
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx','.png', '.jpg']
  },
  optimization: optimization(),
  devServer: {
    port: 5000,
    hot: isDev
},
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ],
  module: {
    rules: [
      {
          test: /\.css$/,
          use: cssLoaders()               
      },
      {
          test: /\.less$/,
          use: cssLoaders('less-loader')              
      },
      {
          test: /\.s[ac]ss$/,
          use: cssLoaders('sass-loader')                   
      },            
      {
          test: /\.(png|jpg|svg|gif)$/,
          use: ['file-loader']
      },
      {
        test: /\.js$/,
        exclude: /node-modules/,
        loader: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                ]
            }
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node-modules/,
        loader: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                ]
            }
        }
      }                          
    ]
  }
}