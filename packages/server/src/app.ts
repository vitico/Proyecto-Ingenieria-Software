import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import * as db from './db';
import { ItemsController } from './controllers/items.controller';
import { useExpressServer } from 'routing-controllers';
import helmet from 'helmet';
import cors from "cors";
import Youch from "youch";
// @ts-ignore
import forTerminal from "youch-terminal"
import { errorReporter} from "express-youch";
class App {
    public express: express.Application;

    constructor() {
        require('dotenv').config();
        this.express = express();
    }
    async initialize(){
        await this.database();
        this.middleware();
        // this.authorization();
        this.routes();
    }

    public authorization(): void {
        // this.express.use(passport.session());
        // this.express.use(passport.initialize());
    }


    public middleware(): void {

        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(helmet())
        this.express.use(cors())
       

    }

    public async database(): Promise<void> {
       await db.connect();
    }

    public routes(): void {
        useExpressServer(this.express, {
            // register created express server in routing-controllers
            defaultErrorHandler:false,
            routePrefix:"/api",
            controllers: [ItemsController], // and configure it the way you need (controllers, validation, etc.)
        });
        function errorToObj(key:any, value:Error) {
            if (value instanceof Error) {
                var error = {} as any;
                
                
        
                Object.getOwnPropertyNames(value).forEach(function (propName) {
                    //@ts-ignore
                    error[propName] = value[propName] ;
                });
        
                return error;
            }
        
            return value;
        }
        this.express.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            
            new Youch(err, {})
                .toJSON()
                .then((output) => {
                    console.log(forTerminal(output))
                })
            if (res.headersSent) {
                return next(err);
            }
            
            res
                .status(500)
                .contentType("application/json")
                .send(JSON.stringify(err, errorToObj));

        })
    }
}

export default App;