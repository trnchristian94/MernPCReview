var merge = require('webpack-merge');
var common = require('./webpack.config.js');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    plugins: [
        //new BundleAnalyzerPlugin()
    ]
});