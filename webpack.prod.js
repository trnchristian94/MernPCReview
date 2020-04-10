var merge = require("webpack-merge");
var common = require("./webpack.config.js");

module.exports = merge(common, {
  mode: "production",
  devtool: false,
  plugins: [
  ]
});
