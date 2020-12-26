import errorHandlers from './middleware/errorHandlers';
import express from 'express';
import http from 'http';
import middleware from './middleware';
import { applyMiddleware } from './utils';

const app = express();

applyMiddleware(middleware, app);
applyMiddleware(errorHandlers, app);

const server = http.createServer(app);

export default server;
