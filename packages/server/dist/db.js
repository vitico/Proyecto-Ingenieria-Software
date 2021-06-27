"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mockgoose_1 = require("mockgoose");
const dbHost = "db.homelab.vitico.space";
const dbPort = "27017";
const dbName = "movil";
let uri = `mongodb://root:pass12345@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
function connect() {
    return new Promise((resolve, reject) => {
        let doConn = () => {
            return mongoose_1.default.connect(uri, {
                ssl: false, useNewUrlParser: true, useUnifiedTopology: true,
            }).then(() => {
                resolve();
            }).catch(err => reject(err));
        };
        if (process.env.NODE_ENV === 'test') {
            const mockgoose = new mockgoose_1.Mockgoose(mongoose_1.default);
            mockgoose.prepareStorage()
                .then(doConn);
        }
        else {
            doConn();
        }
    });
}
exports.connect = connect;
function close() {
    return mongoose_1.default.disconnect();
}
exports.close = close;
module.exports = { connect, close };
//# sourceMappingURL=db.js.map