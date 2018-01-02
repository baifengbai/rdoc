// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const openBrowser = require('./utils/openBrowser');
const choosePort = require('./utils/choosePort');
const prepareUrls = require('./utils/prepareUrls');
const createCompiler = require('./utils/createCompiler');
const clearConsole = require('./utils/clearConsole');
const paths = require('./conf/paths');
const createDevServerConfig = require('./conf/webpack.config.server');
const webpackConfig = require('./conf/webpack.config.dev');

const DEFAULT_PORT = 3666;
const isInteractive = process.stdout.isTTY;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
let HOST = process.env.HOST || '0.0.0.0';

module.exports = function server(cmd) {
  HOST = cmd.host || HOST;
  choosePort(HOST, DEFAULT_PORT).then((port) => {
    // 我们还没有找到一个端口。
    if (port == null) return;

    const appName = require(paths.appPackage).name;
    const urls = prepareUrls(protocol, HOST, port);
    const compiler = createCompiler(webpack, webpackConfig(cmd), appName, urls);
    const serverConfig = createDevServerConfig(urls.lanUrlForConfig, cmd);

    const devServer = new WebpackDevServer(compiler, serverConfig);
    devServer.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        // clearConsole();
      }
      console.log('Starting the development server...\n');
      // openBrowser(urls.localUrlForBrowser);
    });
  });
}