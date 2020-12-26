import appRoot from 'app-root-path';
import config from '../config/config';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import httpContext from 'express-http-context';
import { createLogger, format, LogEntry, Logger as WinstonLogger, transports } from 'winston';

// https://github.com/winstonjs/winston#logging
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

const logLevel = config.logging.level; // process.env.LOG_LEVEL || 'debug';

function formatParams(info: LogEntry) {
  const context = httpContext.get('loggingContext');
  const logId = context.correlationId ? context.correlationId : 'no-id-set';
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `${ts as string} ${logId as string} ${level as string}: ${
    Object.keys(args).length ? JSON.stringify(args) : ''
  }`;
}

// https://github.com/winstonjs/winston/issues/1135
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.label({ label: config.logging.label }),
  format.align(),
  format.printf(formatParams)
);

const fileFormat = format.combine(
  format.timestamp(),
  format.label({ label: config.logging.label }),
  format.align(),
  format.printf(formatParams)
);

const logDir = appRoot + '/log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const errorLogDailyRotate = new DailyRotateFile({
  level: 'error',
  format: fileFormat,
  filename: `${logDir}/%DATE%-error.log`,
  datePattern: 'YYYY_MM_DD'
});

const combinedLogDailyRotate = new DailyRotateFile({
  level: 'debug',
  format: fileFormat,
  filename: `${logDir}/%DATE%-combined.log`,
  datePattern: 'YYYY_MM_DD'
});

let logger: WinstonLogger;

logger = createLogger({
  exitOnError: false,
  level: logLevel,
  transports: [new transports.Console({ format: consoleFormat }), errorLogDailyRotate, combinedLogDailyRotate]
});

// No console log during test
if (process.env.NODE_ENV === 'test') {
  logger.transports.forEach(t => (t.silent = true));
}

export default logger;
