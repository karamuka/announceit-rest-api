/* eslint-disable no-console */
import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from './app';

use(chaiHttp);

const testAdvertiser = {
  email: 'janedoe@example.com',
  firstName: 'john',
  lastName: 'doe',
  password: 'strongandlong',
  phoneNumber: '250788888888',
  address: 'KG St. 45 AVE',
  is_admin: false,
  token: undefined,
  id: undefined,
};

const testAnnouncement = {
  id: undefined,
  owner: undefined,
  text: 'my custom text',
  startDate: '2019-01-01',
  endDate: '2020-01-01',
};

describe('User', () => {
  describe('Authentication', () => {
    it('should create a new user account', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(testAdvertiser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          return done();
        });
    });

    it('should authenticate a user with valid credentials', (done) => {
      request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: testAdvertiser.email,
          password: testAdvertiser.password,
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          testAdvertiser.id = res.body.data.id;
          testAdvertiser.token = res.body.data.token;
          testAnnouncement.owner = +res.body.data.id;
          return done();
        });
    });
  });

  describe('Announcements', () => {
    it('should create a new announcemen', (done) => {
      request(app)
        .post('/api/v1/announcement')
        .send(testAnnouncement)
        .set('Authorization', testAdvertiser.token)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          testAnnouncement.id = res.body.data.id;
          return done();
        });
    });
    it('should update an announcement', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${testAnnouncement.id}`)
        .send({
          text: 'new updated text',
        })
        .set('Authorization', testAdvertiser.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });
});
