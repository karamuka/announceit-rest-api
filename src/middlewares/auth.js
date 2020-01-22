const { verify } = require('jsonwebtoken');

class Auth {
  static isAuth(req, res, next) {
    const token = req.get('authorization');
    if (!token) {
      const newError = new Error('Unauthorized');
      newError.status = 401;
      next(newError);
    } else {
      verify(token, process.env.TK_CYPHER, (err) => {
        if (err) {
          const newError = new Error('Unauthorized');
          newError.status = 401;
          next(newError);
        } else {
          next();
        }
      });
    }
  }
}

module.exports = Auth;
