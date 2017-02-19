'use strict';

var webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  path = require('path'),
  srcPath = path.join(__dirname, 'client');

module.exports = {
  target: 'web',
  cache: true,
  entry: {
    public: [path.join(srcPath, 'public.js')],
    admin: [path.join(srcPath, 'admin.js')],
    vendor: [path.join(srcPath, 'vendor.js')]
  },
  // entry: {
  //   public: [path.join(srcPath, 'public.js'), 'webpack-hot-middleware/client'],
  //   admin: [path.join(srcPath, 'admin.js'), 'webpack-hot-middleware/client'],
  //   vendor: ['vendor', 'webpack-hot-middleware/client']
  // },
  resolve: {
    root: srcPath,
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'client']
  },
  output: {
    path: path.join(__dirname, 'public/webpack'),
    publicPath: '/webpack/',
    filename: '[name].js',
    pathInfo: true
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.woff$/,
        loader: 'file-loader'
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader'
      },
      {
        test: /\.eot$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css?[hash]-[chunkhash]-[contenthash]-[name]"),
    //   new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery"
    // })
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  debug: true,
  devtool: 'source-map',
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./node_modules/foundation-sites/scss/")]
  }
};
