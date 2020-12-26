import errorHandlers from './middleware/errorHandlers';
import express from 'express';
import http from 'http';
import middleware from './middleware';
import routes from './routes';
import { applyMiddleware, applyRoutes } from './utils';

const app = express();

applyMiddleware(middleware, app);
applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

const server = http.createServer(app);

export default server;
