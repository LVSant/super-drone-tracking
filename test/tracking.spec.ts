import * as chai from 'chai';
import * as Server from '../src/server';
const assert = chai.assert;
const expect = chai.expect;

describe('TastController Tests', () => {
    let server;
    before(done => {
        Server.init().then(s => {
            server = s;
            server.inject({
                method: 'POST',
                url: '/tracking',
                payload: {
                    lat: 13.56729,
                    lon: 5.384755,
                    id: '11'
                }
            }).then(() => {
                done();
            });
        });
    });

    after(done => {
        server.stop();
        done();
    });

    it('Post one tracking', async () => {
        var tracking = {
            lat: 12.5672921,
            lon: 5.384755,
            id: '1'
        };

        const res = await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });

        var responseBody: any = JSON.parse(res.payload);
        assert.equal(201, res.statusCode);
        assert.equal('ok', responseBody.message);
    });

    it('Reading tracking', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/tracking/1',
        });

        var responseBody: any = JSON.parse(res.payload);
        assert.equal(200, res.statusCode);
        assert.equal(12.5672921, responseBody.lat);
        assert.equal(5.384755, responseBody.lon);
        assert.equal(0, responseBody.speed);
        assert.equal(false, responseBody.alert);
    });

    it('Reading all tracking', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/tracking',
        });

        var responseBody: any = JSON.parse(res.payload);
        expect(responseBody).to.be.an('array');
    });

    it('Updating existing tracking information', async () => {
        var tracking = {
            lat: 12.5672941,
            lon: 5.384755,
            id: '1'
        };

        const res = await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });

        var responseBody: any = JSON.parse(res.payload);
        assert.equal(201, res.statusCode);
        assert.equal('ok', responseBody.message);
    });

    it('Updating Tracking information - speed more than zero', async () => {
        let tracking = {
            lat: 10.5672941,
            lon: 5.384755,
            id: '10'
        };

        await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });
        tracking = {
            lat: 11.5672941,
            lon: 5.384755,
            id: '10'
        };

        await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });

        const responseGet = await server.inject({
            method: 'GET',
            url: '/tracking/10',
        });

        var responseGetBody: any = JSON.parse(responseGet.payload);
        assert.equal(200, responseGet.statusCode);
        assert.equal(11.5672941, responseGetBody.lat, );
        assert.equal(5.384755, responseGetBody.lon, );
        assert.isAbove(responseGetBody.speed, 0);
        assert.equal(false, responseGetBody.alert);
    });

    it('Updating drone information - alert should be true', async () => {
        let tracking = {
            lat: 10.5672941,
            lon: 5.384755,
            id: '9'
        };

        Date.now = function () { return 1534119977146; };
        await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });

        Date.now = function () { return 1534129977146; };
        await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });

        const responseGet = await server.inject({
            method: 'GET',
            url: '/tracking/9',
        });

        var responseGetBody: any = JSON.parse(responseGet.payload);
        assert.equal(200, responseGet.statusCode);
        assert.equal(10.5672941, responseGetBody.lat);
        assert.equal(5.384755, responseGetBody.lon, );
        assert.equal(0, responseGetBody.speed);
        assert.equal(true, responseGetBody.alert);
    });

    it('Updating tracking information - speed should be zero', async () => {
        Date.now = function () { return 1534119977146; };

        var tracking = {
            lat: '13.56729',
            lon: '5.384755',
            id: '11'
        };

        await server.inject({
            method: 'POST',
            url: '/tracking',
            payload: tracking
        });

        const responseGet = await server.inject({
            method: 'GET',
            url: '/tracking/11',
        });

        var responseGetBody: any = JSON.parse(responseGet.payload);
        assert.equal(200, responseGet.statusCode);
        assert.equal(13.56729, responseGetBody.lat, );
        assert.equal(5.384755, responseGetBody.lon, );
        assert.equal(responseGetBody.speed, 0, 'Speed should be zero, since drone updated in the same lat/lon');
        assert.equal(false, responseGetBody.alert);
    });


});
