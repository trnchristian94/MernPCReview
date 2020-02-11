var path = require("path");
var Dotenv = require("dotenv-webpack");
module.exports = {
  entry: "./src/app/index.tsx",
  output: {
    path: path.join(__dirname, "/src/public/dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader"
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  node: {
    fs: "empty"
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, ".", ".env")
    })
  ],
  devServer: {
    proxy: {
      "/api": "http://localhost:8080"
    },
    port: 3001,
    contentBase: path.resolve(__dirname, "src/public/"),
    publicPath: "/dist/",
    watchContentBase: true,
    inline: true,
    hot: true,
    watchOptions: {
      poll: true
    },
    historyApiFallback: {
      index: "/"
    }
  }
};
