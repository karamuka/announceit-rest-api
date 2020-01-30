import { Client } from 'pg';
import { config } from 'dotenv';

config();

const {
  PGUSER, PGPASS, PGHOST, PGPORT, PGDB,
} = process.env;

const connStr = `postgresql://${PGUSER}:${PGPASS}@${PGHOST}:${PGPORT}/${PGDB}`;

export default class Database {
  static query({ text, params }) {
    return new Promise((resolve, reject) => {
      const client = new Client({ connectionString: connStr });
      client.connect(() => {
        client.query(text, params, (queryErr, queryRes) => {
          if (queryErr) {
            reject(queryErr);
          } else {
            client.end();
            resolve(queryRes);
          }
        });
      });
    });
  }
}
