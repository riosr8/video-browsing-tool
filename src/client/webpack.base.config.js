/* eslint-disable */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const outputDirectory = "dist";
const merge = require("webpack-merge");
const APP_DIR = path.resolve(__dirname, ".");
// "./src/client/index.js"
module.exports = env => {
  const { PLATFORM, VERSION } = env;
  return merge([
    {
      entry: ["@babel/polyfill", APP_DIR],
      output: {
        path: path.join(__dirname, outputDirectory),
        filename: "bundle.js"
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          },
          {
            test: /\.scss$/,
            use: [
              PLATFORM === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader",
              "css-loader",
              "sass-loader"
            ]
          },
          {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: "url-loader?limit=100000"
          }
        ]
      },
      resolve: {
        // modules: [path.resolve("./node_modules")],
        extensions: ["*", ".js", ".jsx"]
      },
      devServer: {
        port: 3000,
        open: true,
        proxy: [
        {
          context: ['/auth', '/api', '/register', '/noAuth'],
          target: {
            host: "server",
            protocol: 'http:',
            port: 5000
          },
        }]
      },
      plugins: [
        new CleanWebpackPlugin([outputDirectory]),
        new HtmlWebpackPlugin({
          template: "./public/index.html",
          filename: "./index.html"
        }),
        new webpack.DefinePlugin({
          "process.env.VERSION": JSON.stringify(env.VERSION),
          "process.env.PLATFORM": JSON.stringify(env.PLATFORM)
        }),
        new CopyWebpackPlugin([{ from: "static" }])
      ]
    }
  ]);
};
