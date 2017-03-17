const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'client');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
    context: APP_DIR,
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './app.js'
    ],
    output: {
        publicPath: '/',
        path: DIST_DIR,
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            { test: /\.html$/, loader: 'html-loader' },
            { test: /\.js$/, exclude: /(node_modules|bower_components)/, use: ['ng-annotate-loader', 'babel-loader'] },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, use: "file-loader" }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        })
    ]
};