import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { connectDB } from './db/connection.js';
import bootstrap from './app.bootstrap.js';
import { connectRedis } from './common/services/redis.service.js';
import { startCronJobs } from './utils/cron.utils.js';
import { initSocket } from './socket/index.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { createContext } from './graphql/context.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
app.use(express.json());

const startServer = async () => {
    await connectDB();
    await connectRedis();
    startCronJobs();
    initSocket(httpServer);

    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();
    app.use('/graphql', expressMiddleware(apolloServer, { context: createContext }));

    bootstrap(app);

    const listen = (port: number) => {
        httpServer.removeAllListeners('error');
        httpServer.listen(port)
            .on('listening', () => {
                console.log(`Server running on port ${port}`);
                console.log(`GraphQL at http://localhost:${port}/graphql`);
            })
            .on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is in use, trying ${port + 1}...`);
                    listen(port + 1);
                }
            });
    };

    listen(Number(process.env.PORT) || 3000);
};

startServer();