const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const appHost = process.env.HOST || '0.0.0.0';
const appPort = process.env.PORT || '3000';
const server = `http://${appHost}:${appPort}`;

const testUser = {
  email: 'johndoe@example.com',
  first_name: 'john',
  last_name: 'doe',
  password: '123',
  phoneNumber: '250788888888',
  address: 'KG St. 45 AVE',
  is_admin: true,
};

chai.use(chaiHttp);

describe('User Athentication', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user account', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(testUser)
        .end((err, res) => {
          chai.expect(res.status).to.equal(201);
          chai.expect(res.body.status).to.equal('success');
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('POST /api/v1/auth/signin', () => {
    it('should signin a user with valid credentials', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .end((err, res) => {
          chai.expect(res.status).to.equal(200);
          chai.expect(res.body.status).to.equal('success');
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
    it('should not signin a user with invalid credentials', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: 'invalid@example.com',
          password: 'invalid',
        })
        .end((err, res) => {
          chai.expect(res.status).to.equal(401);
          chai.expect(res.body.status).to.equal('error');
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });
});
