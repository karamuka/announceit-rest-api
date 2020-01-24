import { use, request, expect } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app';

const testAnnouncement = {
  owner: 1579807250964,
  text: 'my custom text',
  start_date: '2019-01-01',
  end_date: '2020-01-01',
};

use(chaiHttp);

describe('Announcements', () => {
  describe('POST /api/v1/announcements', () => {
    it('should create a new announcements', (done) => {
      request(app)
        .post('/api/v1/announcements')
        .send(testAnnouncement)
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
