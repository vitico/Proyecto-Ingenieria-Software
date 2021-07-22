import { Application, Request, Response, NextFunction, Handler } from 'express';
import { buildTypeDefsAndResolvers, buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { ApolloServer } from 'apollo-server-express';
import {
    postgraphile,
    PostGraphileResponseNode,
    PostGraphileResponse,
} from 'postgraphile';
import graphqlPlayground from 'graphql-playground-middleware-express';
import { buildContext, createOnConnect } from 'graphql-passport';
//npx postgraphile -c 'postgres://postgres:changeme@192.168.1.104/movil' --watch --enhance-graphiql --dynamic-json
import { createServer, Server } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
const convertHandler =
    (handler: (res: PostGraphileResponse) => Promise<void>) =>
    (request: Request, response: Response, next: NextFunction) => {
        handler(new PostGraphileResponseNode(request, response, next));
    };

export async function setupExpressGraphql(
    express: Application,
    httpServer: Server,
    sharedMiddleware: Handler[]
): Promise<void> {
    const schema = await buildSchema({
        resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
        container: Container,
    });

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => buildContext({ req, res }),
    });
    const subscriptionServer = SubscriptionServer.create(
        {
            // This is the `schema` we just created.
            schema,
            // These are imported from `graphql`.
            execute,
            subscribe,
            onConnect: createOnConnect(sharedMiddleware as any),
        },
        {
            // This is the `httpServer` we created in a previous step.
            server: httpServer,
            // This `server` is the instance returned from `new ApolloServer`.
            path: server.graphqlPath,
        }
    );

    // Shut down in the case of interrupt and termination signals
    // We expect to handle this more cleanly in the future. See (#5074)[https://github.com/apollographql/apollo-server/issues/5074] for reference.

    await server.start();
    server.applyMiddleware({
        app: express,
        path: '/graphql',
        bodyParserConfig: { limit: '50mb' },
        cors: true,
    });

    express.get(
        '/playground',
        graphqlPlayground({
            endpoint: '/graphql',
        })
    );
    const middleware = postgraphile(
        'postgres://postgres:changeme@192.168.1.104/movil',
        'public',
        {
            /* ... options here ... */
            graphqlRoute: '/graphql2',
            graphiqlRoute: '/graphiql',
            graphiql: true,
            enhanceGraphiql: true,
            enableCors: true,
        }
    );
    express.options(
        middleware.graphqlRoute,
        convertHandler(middleware.graphqlRouteHandler)
    );

    // This is the main middleware
    express.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));

    // GraphiQL, if you need it
    if (middleware.options.graphiql) {
        if (middleware.graphiqlRouteHandler) {
            express.head(
                middleware.graphiqlRoute,
                convertHandler(middleware.graphiqlRouteHandler)
            );
            express.get(
                middleware.graphiqlRoute,
                convertHandler(middleware.graphiqlRouteHandler)
            );
        }
        // Remove this if you don't want the PostGraphile logo as your favicon!
        if (middleware.faviconRouteHandler) {
            express.get('/favicon.ico', convertHandler(middleware.faviconRouteHandler));
        }
    }

    // If you need watch mode, this is the route served by the
    // X-GraphQL-Event-Stream header; see:
    // https://github.com/graphql/graphql-over-http/issues/48
    if (middleware.options.watchPg) {
        if (middleware.eventStreamRouteHandler) {
            express.options(
                middleware.eventStreamRoute,
                convertHandler(middleware.eventStreamRouteHandler)
            );
            express.get(
                middleware.eventStreamRoute,
                convertHandler(middleware.eventStreamRouteHandler)
            );
        }
    }
}
