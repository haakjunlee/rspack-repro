import path from "path";
import { fileURLToPath } from "url";
import {
  HtmlRspackPlugin,
  SwcJsMinimizerRspackPlugin as SwcJsMinimizerPlugin,
} from "@rspack/core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index",
  },
  plugins: isRunningRspack ? [new HtmlRspackPlugin()] : [],
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|ts)$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          detectSyntax: "auto",
          minify: true,
          jsc: {
            minify: {
              compress: {
                unsafe_Function: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.css$/,
        type: "css/auto",
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new SwcJsMinimizerPlugin({
        minimizerOptions: {
          compress: {unsafe_Function: true,},
        },
      }),
    ],
  },
};

export default config;
