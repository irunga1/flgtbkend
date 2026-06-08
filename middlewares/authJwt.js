const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

function authJwt(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const [scheme, token] = authHeader.split(' ');

    if (!token || scheme !== 'Bearer') {
      return res.status(401).json({ status: 'error', desc: 'Unauthorized: token missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 'error', desc: 'Unauthorized: invalid token' });
      }

      // Puedes ampliar este objeto con más datos según el payload
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ status: 'error', desc: 'Unauthorized' });
  }
}

module.exports = { authJwt };

