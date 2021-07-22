import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import * as db from './db';
import { ItemsController } from './controllers/items.controller';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import helmet from 'helmet';
import cors from 'cors';
import Youch from 'youch';
// @ts-ignore
import forTerminal from 'youch-terminal';
//@ts-ignore
import protect from '@risingstack/protect';
import compression from 'compression';
import { setupExpressGraphql } from './expressGraphql';
import passport from 'passport';
import session from 'express-session';
import { Server, createServer } from 'http';
useContainer(Container);
class App {
    public express: express.Application;
    public server: Server;
    sharedMiddleware: express.Handler[] = [];
    constructor() {
        require('dotenv').config();
        this.express = express();
        this.server = createServer(this.express);
    }
    async initialize() {
        await this.database();
        this.middleware();
        this.authorization();

        await this.graphql();

        this.routes();

        this.sharedMiddleware.forEach((handler) => this.express.use(handler));
    }

    public authorization(): void {
        this.sharedMiddleware.push(passport.initialize());
        this.sharedMiddleware.push(passport.session());
    }
    public async graphql() {
        await setupExpressGraphql(this.express, this.server, this.sharedMiddleware);
    }

    public middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(compression());
        this.securityMiddleware();
    }
    securityMiddleware(): void {
        this.express.use(cors());
        this.express.use(
            helmet({
                contentSecurityPolicy: false,
            })
        );
        this.express.use(
            protect.express.sqlInjection({
                body: true,
                loggerFunction: console.error,
            })
        );

        this.express.use(
            protect.express.xss({
                body: true,
                loggerFunction: console.error,
            })
        );
        this.sharedMiddleware.push(
            session({
                secret: 'thisisasupersecretsecretfortheseceretpropertyinthesession',
                saveUninitialized: true,
                resave: false,
            })
        );
    }

    public async database(): Promise<void> {
        await db.connect();
    }

    public routes(): void {
        useExpressServer(this.express, {
            // register created express server in routing-controllers
            defaultErrorHandler: false,
            routePrefix: '/api',
            controllers: [ItemsController], // and configure it the way you need (controllers, validation, etc.)
        });

        this.express.use(
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                new Youch(err, {}).toJSON().then((output) => {
                    console.log(forTerminal(output));
                });
                if (res.headersSent) {
                    return next(err);
                }

                res.status(500)
                    .contentType('application/json')
                    .send(JSON.stringify(err, errorToObj));
            }
        );
    }
}
function errorToObj(key: any, value: Error) {
    if (value instanceof Error) {
        const error = {} as Record<string, unknown>;

        Object.getOwnPropertyNames(value).forEach(function (propName: any) {
            //@ts-ignore
            error[propName] = value[propName];
        });

        return error;
    }

    return value;
}

export default App;
