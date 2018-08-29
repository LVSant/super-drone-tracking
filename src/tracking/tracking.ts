export interface Tracking {
    droneId: string;
    lat: number;
    lon: number;
    alert: boolean;
    speed: number;
    createdAt: number;
    lastMove: number;
}

export interface NewTracking {
  id: string;
  lat: number;
  lon: number;
}
