import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Tracking, NewTracking } from './tracking';
import { Request } from '../interfaces/request';
import * as Geolib from 'geolib';
import * as Repository from '../repository';

export default class TrackingController {
  private alertTime: number;
  constructor() {
    this.alertTime = 10;
  }

  /**
   * Creates a registry of Tracking if not found any with given ID,
   * or updates tracking information if found any with given ID
   * @param request HTTP Request Interface
   * @param h Hapi response Toolkit
   * @see Tracking
   */
  public async createTracking(request: Request, h: Hapi.ResponseToolkit) {
    const newTracking: NewTracking = <NewTracking>request.payload;
    try {
      await this.refreshTracking(newTracking);
      return h.response(JSON.stringify({ message: 'ok' })).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }

  /**
   * Return one tracking information by drone ID
   * @param request HTTP Request Interface
   * @param h Hapi response Toolkit
   */
  public async getTrackingById(request: Request, h: Hapi.ResponseToolkit) {
    const tracking: Tracking = Repository.getDrones().find(tracking => tracking.droneId === request.params['id']);
    this.checkLostContact();
    if (tracking) {
      return tracking;
    } else {
      return Boom.notFound();
    }
  }

  /**
   * Returns all tracking information, or 404 if there arent any
   * @param request HTTP Request Interface
   * @param h Hapi response Toolkit
   */
  public async getTrackings(request: Request, h: Hapi.ResponseToolkit) {
    if (Repository.getDrones().length) {
      this.checkLostContact();
      return h.response(Repository.getDrones());
    } else {
      return h.response(JSON.stringify({ message: 'No drones yet' })).code(204);
    }
  }

  /**
   * Check if a drone is inactive for ten seconds or more
   */
  private checkLostContact() {
    Repository.getDrones().forEach((tracking) => {
      if (((Date.now() - tracking.lastMove) / 1000) >= this.alertTime) {
        tracking.alert = true;
      }
    });
  }

  /**
    * Creates a registry of Tracking if not found any with given ID,
    * or updates tracking information if found any with given ID
    * @param newTracking HTTP Request Interface
    * @see Tracking
    * @see NewTracking
    */

  public async refreshTracking(newTracking: NewTracking) {

    let trackingPositionIndex: number = Repository.getDrones().findIndex((tracking) => {
      return (tracking.droneId === newTracking.id);
    });

    if (trackingPositionIndex >= 0) {
      this.calculateSpeed(trackingPositionIndex, newTracking);
    } else {
      const tracking: Tracking = {
        droneId: newTracking.id,
        lat: newTracking.lat,
        lon: newTracking.lon,
        speed: 0,
        alert: false,
        createdAt: Date.now(),
        lastMove: Date.now()
      };
      Repository.getDrones().push(tracking);
    }
    return;
  }

  /**
   * Method responsible for calculating the drone speed and alert if not moving
   * @param trackingPositionIndex Index of Tracking Information in the dronesTracking array
   * @param newTracking Interface received from the drone
   */
  private calculateSpeed(trackingPositionIndex: number, newTracking: NewTracking) {
    const existingTracking: Tracking = Repository.getDrones()[trackingPositionIndex];
    const lastLocation: any = {
      lat: existingTracking.lat,
      lng: existingTracking.lon,
      time: existingTracking.lastMove
    };
    const newLocation: any = {
      lat: newTracking.lat,
      lng: newTracking.lon,
      time: Date.now()
    };
    const calculatedSpeed: number = Geolib.getSpeed(lastLocation, newLocation);
    existingTracking.speed = calculatedSpeed;
    if (!isFinite(calculatedSpeed)) {
      existingTracking.speed = 1000000000000; //very big speed
    }
    if (calculatedSpeed > 0) {
      existingTracking.lat = newTracking.lat;
      existingTracking.lon = newTracking.lon;
      existingTracking.alert = false;
      existingTracking.lastMove = Date.now();
    }

    this.alertNotMoving(lastLocation, newLocation, existingTracking);
    Repository.getDrones()[trackingPositionIndex] = existingTracking;
  }

  /**
   * Checks if Drone moved more than one meter in 59 seconds.
   * If yes, then set alert as true.
   * If travelled more than one meter in a minute, dont do anything.
   * @param lastLocation Last location recorded from Drone, used for calculation
   * @param newLocation New location received, used for calculation
   * @param existingTracking Tracking object to be updated with alert
   */
  private alertNotMoving(lastLocation: any, newLocation: any, existingTracking: Tracking) {
    const movedDistance: number = Geolib.getDistanceSimple(lastLocation, newLocation);
    if (movedDistance <= 1) {
      if (((Date.now() - existingTracking.lastMove) / 1000) >= this.alertTime) {
        existingTracking.alert = true;
      }
    }
  }
}
