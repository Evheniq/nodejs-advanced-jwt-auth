const userService = require('../Services/userService');

const refresherToken = async (req, res, next) => {
  const notToProcess = ['/signin', '/signup', '/logout']
  const {refreshToken} = req.body;

  if (notToProcess.indexOf(req.url) > -1 || !refreshToken) return next();

  const tokens = await userService.refreshToken(refreshToken);
  req.jwt = tokens;
  next();
}

module.exports = refresherToken;