"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const db = __importStar(require("./db"));
const items_controller_1 = require("./controllers/items.controller");
class App {
    constructor() {
        require("dotenv").config();
        this.express = express_1.default();
        this.database();
        this.setup();
        this.middleware();
        // this.authorization();
        this.routes();
    }
    authorization() {
        // this.express.use(passport.session());
        // this.express.use(passport.initialize());
    }
    setup() {
        this.express.set('views', path_1.default.resolve(`${__dirname}/views`));
        this.express.set('view engine', 'pug');
    }
    middleware() {
        this.express.use(morgan_1.default("dev"));
        this.express.use(body_parser_1.default.json());
        this.express.use(body_parser_1.default.urlencoded({ extended: false }));
    }
    database() {
        db.connect();
    }
    routes() {
        this.express.use("/api/items", new items_controller_1.ItemsController().router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map