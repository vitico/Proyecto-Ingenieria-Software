"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@', __dirname);
require("reflect-metadata");
const http_1 = __importDefault(require("http"));
const debug_1 = __importDefault(require("debug"));
const App_1 = __importDefault(require("./App"));
debug_1.default("tsnode-apiserver");
const port = process.env.PORT || 3000;
App_1.default.set("port", port);
const server = http_1.default.createServer(App_1.default);
server.listen(port, () => {
    console.log(`App listening at ${port}`);
});
server.on("error", (error) => {
    switch (error.code) {
        case "EACCES":
            console.error(`${port} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
//# sourceMappingURL=index.js.map