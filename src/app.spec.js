/* eslint-disable no-console */
import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

use(chaiHttp);

const { TEST_TOKEN } = process.env;

const createdData = {
  announcement: {
    id: undefined,
    title: 'test announcement title',
    text: 'test announcement text',
    startDate: '2019-01-01',
    endDate: '2020-01-01',
  },
  user: {
    id: undefined,
    token: undefined,
    email: `${Date.now()}test@announceit.com`,
    password: 'testit@announceit',
    firstName: 'john',
    lastName: 'doe',
    phoneNumber: 250722449977,
    address: 'Test address',
  },
};

describe('Ganeral', () => {
  describe('Check CORS', () => {
    it('it should respond with available http verbs', (done) => {
      request(app)
        .options('')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });
  describe('Check routes availability', () => {
    it('it should respond with 404 not found', (done) => {
      request(app)
        .put('')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });
});

describe('User', () => {
  describe('Authentication', () => {
    it('should create a new user account', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(createdData.user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          createdData.user.id = res.body.data.id;
          createdData.user.token = res.body.data.token;
          return done();
        });
    }).timeout(15000);
    it('should not create a user with invalid input', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send({ email: 'invalid@email' })
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
        .send({
          email: createdData.user.email,
          password: createdData.user.password,
        })
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
          email: 'invalid@email',
          password: 'inva@pass',
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
    it('advertiser should create a new announcement', (done) => {
      request(app)
        .post('/api/v1/announcement')
        .send(createdData.announcement)
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          createdData.announcement.id = res.body.data.id;
          return done();
        });
    }).timeout(15000);
    it('advertiser should not create an announcement with invalid input', (done) => {
      request(app)
        .post('/api/v1/announcement')
        .send({ title: '' })
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('advertiser should update a specific announcement', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', createdData.user.token)
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
    it('admin should update announcement status', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', TEST_TOKEN)
        .send({
          status: 'active',
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
        .patch(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', createdData.user.token)
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
    it('user should not update an announcement with invalid auth token', (done) => {
      request(app)
        .patch(`/api/v1/announcement/${+createdData.announcement.id}`)
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
    it('advertiser should view all his/her announcements', (done) => {
      request(app)
        .get('/api/v1/announcement')
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('user should not view announcements with invalid auth token', (done) => {
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
    it('user should view announcements by status', (done) => {
      request(app)
        .get('/api/v1/announcement/?status=pending')
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('user should view a specific announcement', (done) => {
      request(app)
        .get(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('user should not view an announcement with invalid id', (done) => {
      request(app)
        .get('/api/v1/announcement/1545')
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('user should not view an announcement with invalid auth token', (done) => {
      request(app)
        .get(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', 'INVALID=&&_0bisvonlsfkvsvlmsfvh')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('advertiser should not delete announcement', (done) => {
      request(app)
        .delete(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', createdData.user.token)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
    it('admin should delete announcement', (done) => {
      request(app)
        .delete(`/api/v1/announcement/${+createdData.announcement.id}`)
        .set('Authorization', TEST_TOKEN)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    }).timeout(15000);
  });
});
