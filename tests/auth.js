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
});
