const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token || token == '') {
    req.isAuth = false;
    next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
  } catch (error) {
    req.isAuth = false;
    next();
  }  
  if (!decodedToken) {
    req.isAuth = false;
    next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}