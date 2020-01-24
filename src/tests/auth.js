import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app';

const testUser = {
  email: 'valid@example.com',
  first_name: 'john',
  last_name: 'doe',
  password: 'strongandlong',
  phoneNumber: '250788888888',
  address: 'KG St. 45 AVE',
  is_admin: true,
};

const testCrendentials = {
  email: testUser.email,
  password: testUser.password,
};

use(chaiHttp);

describe('User Athentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user account', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });

  describe('POST /api/v1/auth/signin', () => {
    it('should signin a user with valid credentials', (done) => {
      request(app)
        .post('/api/v1/auth/signin')
        .send(testCrendentials)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          if (err) {
            return done(err);
          }
          return done();
        });
    });
    it('should not signin a user with invalid credentials', (done) => {
      request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'invalid@example.com',
          password: 'invalid',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          if (err) {
            return done(err);
          }
          return done();
        });
    });
  });
});
