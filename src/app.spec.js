/* eslint-disable no-console */
import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { config } from 'dotenv';
import app from './app';

config();
use(chaiHttp);

const {
  TEST_EMAIL, TEST_PASSWORD, TEST_TOKEN, TEST_ANNOUNCEMENT_ID,
} = process.env;

const testCredentials = {
  email: TEST_EMAIL,
  password: TEST_PASSWORD,
  token: TEST_TOKEN,
};

describe('User', () => {
  describe('Authentication', () => {
    it('should create a new user account', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: `${Date.now()}test@announceit.com`,
          password: 'test@announceit',
          firstName: 'john',
          lastName: 'doe',
          phoneNumber: 250722111111,
          address: 'Test address',
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            console.log(err);
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not create a user with invalid input', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: `${Date.now()}test@announceit`,
          password: 'test',
          firstName: 'john',
          lastName: 'doe',
          phoneNumber: 2507221,
          address: 'Test address',
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          if (err) {
            console.log(err);
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should authenticate a user with valid credentials', (done) => {
      request(app)
        .post('/api/v1/auth/signin')
        .send(testCredentials)
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
        .send({
          title: 'my custom test announcement title',
          text: 'my custom test announcement text',
          startDate: '2019-01-01',
          endDate: '2020-01-01',
        })
        .set('Authorization', testCredentials.token)
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
        .set('Authorization', testCredentials.token)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should update an announcement', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${TEST_ANNOUNCEMENT_ID}`)
        .set('Authorization', testCredentials.token)
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
    it('advertiser should not update an announcement status', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${TEST_ANNOUNCEMENT_ID}`)
        .set('Authorization', testCredentials.token)
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
        .patch(`/api/v1/announcement/${TEST_ANNOUNCEMENT_ID}`)
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
    it('should get all announcements', (done) => {
      request(app)
        .get('/api/v1/announcement')
        .set('Authorization', testCredentials.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not get announcements with invalid auth token', (done) => {
      request(app)
        .get('/api/v1/announcement')
        .set('Authorization', 'INVALID=&&_0bisvonlsfkvsvlmsfvh')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should get announcements by status', (done) => {
      request(app)
        .get('/api/v1/announcement/?status=pending')
        .set('Authorization', testCredentials.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should get one announcement', (done) => {
      request(app)
        .get(`/api/v1/announcement/${TEST_ANNOUNCEMENT_ID}`)
        .set('Authorization', testCredentials.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not get one announcement with invalid id', (done) => {
      request(app)
        .get('/api/v1/announcement/1545')
        .set('Authorization', testCredentials.token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('should not get one announcement with invalid auth token', (done) => {
      request(app)
        .get(`/api/v1/announcement/${TEST_ANNOUNCEMENT_ID}`)
        .set('Authorization', 'INVALID=&&_0bisvonlsfkvsvlmsfvh')
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
