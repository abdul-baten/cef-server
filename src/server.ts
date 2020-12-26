import app from './app';
import config from './config/config';

export const startServer = () => {
  process.on('uncaughtException', e => {
    console.error(e);
    process.exit(1);
  });

  process.on('unhandledRejection', e => {
    console.error(e);
    process.exit(1);
  });

  const { port = 6064 } = config;

  return app.listen(port as number, () => console.info(`Server is running at ${port as number}...`));
};

startServer();
