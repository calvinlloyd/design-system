/* eslint-disable filenames/match-exported */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const getDocsDistPath = require('../common/getDocsDistPath');

function createWebpackConfig(sourcePackageDir, docsPackageDir, options) {
  const distPath = getDocsDistPath(docsPackageDir, options.rootPath, 'public/scripts/');
  // TODO: automatically include core npm package for child DS?
  const includePaths = [
    fs.realpathSync(path.resolve(sourcePackageDir, 'src')),
    fs.realpathSync(path.resolve(docsPackageDir, 'src'))
  ];

  const config = {
    mode: process.env.NODE_ENV,
    context: __dirname,
    entry: {
      index: [path.resolve(docsPackageDir, 'src/scripts/index.jsx')],
      example: [path.resolve(docsPackageDir, 'src/scripts/example.js')]
    },
    output: {
      path: distPath,
      publicPath: distPath,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env']
              }
            }
          ],
          include: includePaths
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          root: JSON.stringify(options.rootPath),
          githubUrlBase: JSON.stringify(options.githubUrl),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: ['../', 'node_modules']
    },
    performance: {
      hints: false
    }
  };

  if (process.env.NODE_ENV === 'production') {
    config.optimization = {
      minimize: true
    };
  } else {
    // Hot reload is enabled for non production envs
    const keys = ['index']; // Object.keys(config.entry);

    keys.forEach(key => {
      config.entry[key] = ['react-hot-loader/patch', 'webpack-hot-middleware/client'].concat(
        config.entry[key]
      );
    });

    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return config;
}

module.exports = createWebpackConfig;
