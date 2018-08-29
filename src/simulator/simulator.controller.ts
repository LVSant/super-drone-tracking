import { NewTracking } from './../tracking/tracking';
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Request } from '../interfaces/request';
import TrackingController from '../tracking/tracking.controller';

export default class SimulatorController {
  trackingController: TrackingController;

  constructor(trackingController: TrackingController) {
    this.trackingController = trackingController;
  }

  /**
   * Creates a registry of Tracking if not found any with given ID,
   * or updates tracking information if found any with given ID
   * @param request HTTP Request Interface
   * @param h Hapi response Toolkit
   * @see Tracking
   */
  public async moveDrones(request: Request, h: Hapi.ResponseToolkit) {
    try {
      this.randomizeLocation();
      return h.response(JSON.stringify({ message: 'Drones moved' })).code(200);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  public async showSimulator(request: Request, h: any) {
    try {
      return h.file('./dist/template/index.html');
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  private getRandom(): number {
    const min: number = Math.ceil(0);
    const max: number = Math.floor(30);
    return (Math.random() * (max - min)) / 1000000;
  }

  private randomizeLocation() {

    let drones: NewTracking[] = [{
      id: '1',
      lat: -22.583 + this.getRandom(),
      lon: 47.409,
    },
    {
      id: '2',
      lat: -22.5838,
      lon: 47.4207 + this.getRandom(),
    },
    {
      id: '3',
      lat: -22.6348 + this.getRandom(),
      lon: 47.4097 + this.getRandom(),
    },
    {
      id: '4',
      lat: -22.583872 + this.getRandom(),
      lon: 47.409735,
    },
    {
      id: '5',
      lat: -22.54823 + this.getRandom(),
      lon: 47.40973 + this.getRandom(),
    },
    {
      id: '6',
      lat: -22.58387,
      lon: 47.40973,
    },
    {
      id: '7',
      lat: -22.5822 + this.getRandom(),
      lon: 47.4403 + this.getRandom(),
    },
    {
      id: '8',
      lat: -22.3417 + this.getRandom(),
      lon: 47.4973,
    },
    {
      id: '9',
      lat: -22.58387,
      lon: 47.4019 ,
    }];

    drones.forEach(drone => {
      this.trackingController.refreshTracking(drone);
    });

  }

}
