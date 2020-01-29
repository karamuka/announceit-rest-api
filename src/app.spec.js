/* eslint-disable no-console */
import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

use(chaiHttp);

const testData = {
  credentials: {
    email: 'test@announceit.com',
    password: 'test@announceit',
  },
  announcement: {
    id: 1580329945061,
    title: 'my custom test announcement title',
    text: 'my custom test announcement text',
    startDate: '2019-12-31T22:00:00',
    endDate: '2020-02-29T22:00:00',
  },
  newUser: {
    email: `${Date.now()}test@announceit.com`,
    password: 'test@announceit',
    firstName: 'john',
    lastName: 'doe',
    phoneNumber: 250722111111,
    address: 'Test address',
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiZGE1MTA1YzI3YjQ4MTk2ZjJhOWU2ZGE3MTRmZmIzODEzYzYxZmE4MDUwMGJjZTI4ZmUwOWQ2OTZhNWYyNDNmMmJmNWMzNzRhMTNmMGYxMWNhOThiYWVhYWRiODQ4MGRhIiwiaWF0IjoxNTgwMzIzMTIyLCJleHAiOjE1ODA5Mjc5MjJ9._rY2_iUdroE2ZNPz7pB265qIMZkf3BFEWUeoV6HlqkA',
};

describe('User', () => {
  describe('Authentication', () => {
    it('should create a new user account', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(testData.newUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not create a user with invalid input', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send({ phoneNumber: 2507221 })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should authenticate a user with valid credentials', (done) => {
      request(app)
        .post('/api/v1/auth/signin')
        .send(testData.credentials)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not authenticate a user with invalid credentials', (done) => {
      request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'invalid@announceit',
          password: 'invalidpass',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
  });

  describe('Announcements', () => {
    it('should create a new announcement', (done) => {
      request(app)
        .post('/api/v1/announcement')
        .send(testData.announcement)
        .set('Authorization', testData.token)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not create an announcement with invalid input', (done) => {
      request(app)
        .post('/api/v1/announcement')
        .send({
          title: '',
          text: 'my custom test announcement text',
          startDate: '2019-01-01-01',
          endDate: '2020-01-01',
        })
        .set('Authorization', testData.token)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should update a specific announcement', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${testData.announcement.id}`)
        .set('Authorization', testData.token)
        .send({
          text: 'new updated text from test',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('advertiser should not update announcement status', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${testData.announcement.id}`)
        .set('Authorization', testData.token)
        .send({
          status: 'active',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not update an announcement with invalid auth token', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${testData.announcement.id}`)
        .set('Authorization', 'vvbifbiusfvoun')
        .send({
          status: 'active',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should view all his/her announcements', (done) => {
      request(app)
        .get('/api/v1/announcement')
        .set('Authorization', testData.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not view announcements with invalid auth token', (done) => {
      request(app)
        .get('/api/v1/announcement')
        .set('Authorization', 'INVALID=ii_0bisvonlsfkvsvlmsfvh')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should view announcements by status', (done) => {
      request(app)
        .get('/api/v1/announcement/?status=pending')
        .set('Authorization', testData.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should view a specific announcement', (done) => {
      request(app)
        .get(`/api/v1/announcement/${testData.announcement.id}`)
        .set('Authorization', testData.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not view an announcement with invalid id', (done) => {
      request(app)
        .get('/api/v1/announcement/1545')
        .set('Authorization', testData.token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not view an announcement with invalid auth token', (done) => {
      request(app)
        .get(`/api/v1/announcement/${testData.announcement.id}`)
        .set('Authorization', 'INVALID=ll_0bisvonlsfkvsvlmsfvh')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
  });
});
