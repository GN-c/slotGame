var path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" }],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    host: "127.0.0.1",
    port: 8080,
    open: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      eventemitter3: path.resolve(__dirname, "./node_modules/eventemitter3"),
    },
    modules: [
      path.resolve(__dirname, "./node_modules/phaser/src"),
      path.resolve(__dirname, "./node_modules"),
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: true,
          ie8: false,
          ecma: 5,
          output: { comments: false },
          warnings: false,
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "typeof CANVAS_RENDERER": JSON.stringify(false),
      "typeof WEBGL_RENDERER": JSON.stringify(true),
      "typeof EXPERIMENTAL": JSON.stringify(false),
      "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
      "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "assets", to: "assets" }],
    }),
  ],
};
