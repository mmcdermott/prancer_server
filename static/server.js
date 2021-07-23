import { DEFAULT_PORT, SERVER_ADDRESS } from './constants.js';

import * as http from 'http';
import * as express from 'express';

import * as httpProxy from 'http-proxy';
//import pkg from 'http-proxy';
//const {httpProxy} = pkg

import * as path from 'path';
import * as register from '@babel/register'
import * as polyfill from '@babel/polyfill'

console.log(httpProxy)

const proxy = httpProxy.createProxyServer({});

const app = express();

app.use(require('morgan')('short'));

(function initWebpack() {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack/common.config');

    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath,
    }));

    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
    }));

    app.use(express.static(path.join(__dirname, '/')));
}());

app.all(/^\/api\/(.*)/, (req, res) => {
    proxy.web(req, res, { target: SERVER_ADDRESS });
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});


const server = http.createServer(app);
server.listen(process.env.PORT || DEFAULT_PORT, () => {
    const address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
});
