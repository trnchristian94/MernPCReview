// webpack.dev.js
var merge = require("webpack-merge");
var common = require("./webpack.config.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map"
});
