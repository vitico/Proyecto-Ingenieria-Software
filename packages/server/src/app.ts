import  path from "path";
import  express from "express";
import  logger from "morgan";
import  bodyParser from "body-parser";
import  mongoose from "mongoose";
import * as db from "./db";
import { ItemsController } from "./controllers/items.controller";

class App {
    public express: express.Application;

    constructor() {
        require("dotenv").config();

        this.express = express();
        this.database();
        this.setup();
        this.middleware();
        // this.authorization();
        this.routes();
    }

    public authorization(): void {
        // this.express.use(passport.session());
        // this.express.use(passport.initialize());
    }

    public setup(): void {
        this.express.set('views', path.resolve(`${__dirname}/views`));
        this.express.set('view engine', 'pug');
    }

    public middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    public database() {
        db.connect();
    }

    public routes(): void {
        this.express.use("/api/items", new ItemsController().router);
    }
}

export default new App().express;