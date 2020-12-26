import {
  handleCors,
  handleBodyRequestParsing,
  handleCookieParsing,
  handleCompression,
  loggingMiddleware
} from './common';

export default [loggingMiddleware, handleCors, handleBodyRequestParsing, handleCookieParsing, handleCompression];
