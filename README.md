# Drone Tracking
Drone Tracking is a Node.js project built with Hapi.js in Typescript for tracking drone positions around the globe.
It provides Drone Actual Speed and Alerts if It's not moving.

## API Documentation
The API documentation can be found at **/docs**. 

## Assumptions
In order to reduce network usage, the drones send just its identifier and actual location, as below:
```
{
    lat: number,
    lon: number,
    id: string
}
```
Also, I assumed that the device can send data to server in any frequency.
The server will calculate the speed based on the difference of actual location and last location.
Drones that move less than a meter in 59 seconds will be flagged with alert.

## Stack
### Frontend
Single file with AngularJS and Bootstrap, for highlighting a table row if the drone alert is true.


Frontend built with:
* AngularJS - HTML enhanced for web apps!
* Bootstrap 4 - CSS framework

### Backend
The backend was divided in two modules. **Tracking** and **Simulator**.
The main logic is in the Tracking Module, where all drone management is coded.
Also, there's a static array at **Repository** to store tracking data. 

#### Tracking
The file `tracking.controller.ts` is where the logic core is located.
It all starts at the method `refreshTracking`.

The algorithm searchs for an existing drone with given id.

If found, the speed is calculated comparing the actual latitude and longitude with the last latitude and longitude received.
If ten seconds passed since the last time a drone moved more than a meter, this drone registry is flagged with `alert = true`

If there are no drones in **Repository** with given id, a new tracking registry is created, with zero speed and not alerts.

Every time you get any tracking information, the system checks if there are any inactive drones. Drones that didn't send updates in ten seconds are flagged with `alert = true`


Backend built with:
* Node.js - Event driven I/O app for the backend
* HapiJS - Node.js app framework, fast and with a ton of plugins
* Typescript - Javascript with Types, for reducing commong js errors
* chai - Assertion library for js projects
* good - Logging library for HapiJS
* tslint - Linter for Typescript
* happi-swagger - Hapi plugin for generating Swagger documentation
* vision - Hapi plugin for rendering views like swagger
* inert - Hapi plugin for serving static files 
* geolib - Library to provide basic geospatial operations like distance calculation

## Installation
### Running in Docker
Just run

```
docker build . -t leonardo/super
docker run --name drone -p 8080:3000 -d leonardo/super
```
- Open the [Simulator](http://localhost:8080) and have fun
### Installing App
- `npm install`
### Running tests
- `npm run test`
### Starting app
- `npm run start`

## Tests
### Tracking 
There are 7 tests in the app, that covers the following cases:
- Creating tracking information with success
- Updates tracking information that exists
- Get a single tracking by Drone ID
- Get all trackings returning an array
- Post a new tracking that results in speed above zero
- Post a new tracking that results in speed equals zero
- Post trackings that results in alert by not moving in a ten seconds


## Comments
I really enjoyed building the project.
It was hard to put an end, because coding it was so fun.
