var path = require("path");
module.exports = {
  entry: "./src/app/index.tsx",
  output: {
    path: path.join(__dirname, "/src/public/dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      src: path.resolve(__dirname, "src/"),
      utils: path.resolve(__dirname, "src/utils/"),
      components: path.resolve(__dirname, "src/app/components/"),
      layout: path.resolve(__dirname, "src/app/components/layout/"),
      core: path.resolve(__dirname, "src/app/components/core/"),
      common: path.resolve(__dirname, "src/app/components/layout/common/"),
      userLogic: path.resolve(__dirname, "src/userLogic/"),
      db: path.resolve(__dirname, "src/db/"),
      "@material-ui/core": "@material-ui/core/es"
    }
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
        test: /\.m?tsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader?optional=runtime&cacheDirectory",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"]
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader?optional=runtime&cacheDirectory",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"]
          }
        }
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
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://localhost:8000",
        secure: false
      }
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
