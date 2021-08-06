const moduleAlias = require('module-alias');
moduleAlias.addAlias('@hhapp/server', __dirname);
import 'reflect-metadata';

import http from 'http';
import debug from 'debug';
import App from './app';

debug('tsnode-apiserver');

const port: number | string = process.env.PORT || 3000;
(async (): Promise<void> => {
    const app = new App();
    await app.initialize();
    // app.express.set("port", port);
    app.server.listen(port);
    console.log('listening');
})();
