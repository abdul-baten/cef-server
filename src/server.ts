import app from './app';
import config from './config/config';
import { Database } from './utils/database';

export const startServer = async () => {
  process.on('uncaughtException', e => {
    console.error(e);
    process.exit(1);
  });

  process.on('unhandledRejection', e => {
    console.error(e);
    process.exit(1);
  });

  const {
    port = 6064,
    database: { url }
  } = config;

  await Database.connect(url);

  return app.listen(port as number, () => console.info(`Server is running at ${port as number}...`));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
startServer();
