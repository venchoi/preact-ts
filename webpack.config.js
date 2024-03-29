const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
// const WebpackShellPlugin = require("webpack-shell-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const mode = process.env.NODE_ENV || "development"; // development production
const selectorName =
  process.env.NODE_ENV === "production"
    ? "[hash:base64:8]"
    : "[name]_[local]_[hash:base64:4]";

const config = {
  entry: "./src/index",
  externals: { jquery: "jQuery" },
  output: {
    filename:
      mode === "production" ? "[name].[contenthash].js" : "[name].[hash].js",
    publicPath: mode === "production" ? "https://assets.shoplazza.com/" : "/",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[hash:4].[ext]"
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            // {
            //   loader: 'css-loader',
            //   query: {
            //     minimize: process.env.NODE_ENV === 'production',
            //     importLoaders: 1,
            //     module: true,
            //     localIdentName: selectorName
            //   }
            // },
            {
              loader: "typings-for-css-modules-loader",
              options: {
                modules: true,
                camelCase: true,
                banner:
                  "// This file is automatically generated from your CSS. Any edits will be overwritten.",
                namedExport: true
                // localIdentName: "[local]_[hash:base64:5]"
              }
            },
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        })
      },
      {
        test: /\.[tj]sx?$/,
        loader: "ts-loader"
      }
    ]
  },
  // mode,
  plugins: [
    // new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      templateParameters: { title: "店匠科技" },
      template: path.resolve(__dirname, "src/index.html")
    }),
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    new webpack.DefinePlugin({
      "React.createElement": "__preactCreateElement"
    }),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    })
  ],
  devServer: {
    watchContentBase: true,
    contentBase: "./dist",
    hot: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "https://shop.preview.shoplazza.com",
        secure: false,
        changeOrigin: true,
        headers: {
          Cookie: "awesomefrontcookie=a42de2502f370edb03507cfec71ae08f"
        }
      },
      "/assets": {
        target: "https://shop.preview.shoplazza.com",
        secure: false,
        changeOrigin: true
      }
    }
  }
};

if (mode === "development") {
  config.plugins.push(new webpack.HotModuleReplacementPlugin()); // 启用HMR,与[chunkhash].js 冲突
}
module.exports = config;
