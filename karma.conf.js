module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: ["src/test/**/*.spec.js"],
    preprocessors: {
      "src/test/**/*.spec.js": ["webpack"]
    },
    webpack: {
      mode: "development",
      devtool: false,
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }]
                ],
                // Instrumenta el código fuente (no los .spec) para el reporte de cobertura
                plugins: [["istanbul", { exclude: ["**/*.spec.js", "**/test/**"] }]]
              }
            }
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          }
        ]
      },
      resolve: {
        extensions: [".js", ".jsx"]
      }
    },
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage/",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "json-summary", subdir: ".", file: "coverage-summary.json" }
      ]
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu"]
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["ChromeHeadlessNoSandbox"],
    singleRun: true,
    concurrency: Infinity
  });
};
