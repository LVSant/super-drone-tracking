import * as Hapi from 'hapi';

export interface Request extends Hapi.Request {
    payload: any;
    params: any;
}
