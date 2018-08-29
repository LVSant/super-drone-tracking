import { Tracking } from './../tracking/tracking';
let dronesTracking: Tracking[];

export function init() {
  dronesTracking = [];
}

export function getDrones(): Tracking[] {
  return dronesTracking;
}
