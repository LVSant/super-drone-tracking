import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as HapiSwagger from 'hapi-swagger';
import * as Good from 'good';
import * as Tracking from './tracking';
import * as Simulator from './simulator';
import * as Repository from './repository';

export async function init(): Promise<Hapi.Server> {
  try {

    const server = new Hapi.Server({
      port: process.env.PORT || '3000',
      host: '0.0.0.0'
    });

    let swaggerOptions = {
      documentationPath: '/docs',
      pathPrefixSize: 2,
      info: {
        title: 'Drone Tracking API',
        description: 'Below are the endpoints available in the API.',
        version: '1.0.0',
        contact: {
          email: 'leonardoviveirossantos@gmail.com'
        }
      }
    };

    const goodOptions = {
      ops: {
        interval: 1000
      },
      reporters: {
        myConsoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
        }, {
          module: 'good-console'
        }, 'stdout'],
      }
    };

    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
      {
        plugin: Good,
        options: goodOptions
      }
    ]);

    console.log('Plugins registered');
    Repository.init();
    Tracking.init(server);
    Simulator.init(server);

    console.log('Routes registered');
    return server;
  } catch (err) {
    throw err;
  }
}
