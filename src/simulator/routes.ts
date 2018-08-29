import * as Hapi from 'hapi';
import SimulatorController from './simulator.controller';
import TrackingController from '../tracking/tracking.controller';

export default function (
  server: Hapi.Server) {
  const trackingController: TrackingController = new TrackingController();
  const simulatorController: SimulatorController = new SimulatorController(trackingController);
  server.bind(simulatorController);

  server.route({
    method: 'POST',
    path: '/moveDrones',
    handler: simulatorController.moveDrones,
    options: {
      cors: true,
      tags: ['api', 'simulator'],
      description: 'Move drones.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Every call create random locations for drones.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: simulatorController.showSimulator,
    options: {
      cors: true,
      tags: ['api', 'simulator'],
      description: 'Shows Simulator',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Shows the simulator view, with start and stop buttons.'
            }
          }
        }
      }
    }
  });

}
