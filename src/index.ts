import * as Server from './server';

console.log(`Running enviroment ${process.env.NODE_ENV || 'dev'}`);

process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

process.on('unhandledRejection', (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});

const start = async () => {
  try {
    const server = await Server.init();
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error('Error starting server: ', err.message);
    throw err;
  }
};


start();
