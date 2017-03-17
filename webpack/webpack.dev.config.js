const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_DIR = path.dirname(require.main.filename)
const APP_DIR = path.resolve(ROOT_DIR, 'client');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

module.exports = {
    entry: [
        'webpack-hot-middleware/client?reload=true',
        APP_DIR + '/app.js'
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
            template: ROOT_DIR + '/index.html'
        })
    ]
};