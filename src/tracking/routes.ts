import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as TrackingValidator from './tracking.validator';
import TrackingController from './tracking.controller';

export default function (
  server: Hapi.Server) {
  const trackingController: TrackingController = new TrackingController();
  server.bind(trackingController);
  server.route({
    method: 'GET',
    path: '/tracking/{id}',
    handler: trackingController.getTrackingById,
    options: {
      cors: true,
      tags: ['api', 'tracking'],
      description: 'Get last tracking information by id.',
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Tracking founded.'
            },
            '404': {
              description: 'Tracking does not exist.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/tracking',
    handler: trackingController.getTrackings,
    options: {
      cors: true,
      tags: ['api', 'tracking'],
      description: 'Get all tracking information.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'All tracking information in Json.'
            },
            '204': {
              description: 'There are no Tracking Information yet.'
            }
          }
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/tracking',
    handler: trackingController.createTracking,
    options: {
      cors: true,
      tags: ['api', 'tracking'],
      description: 'Send new tracking information.',
      validate: {
        payload: TrackingValidator.createsTrackingModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Created new Tracking information.'
            }
          }
        }
      }
    }
  });
}
