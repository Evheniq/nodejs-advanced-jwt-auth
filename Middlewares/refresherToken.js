const userService = require('../Services/userService');

/*
  You can only choose 1 setting for middleware:
  - Array of allowed urls (forbidden all links except allowed)
      or
  - Array of forbidden urls (allow all links except exceptions)
*/
const refresherToken = ({allowed = [], forbidden = []}) => {
  return async (req, res, next) => {
    // Check correct configuration
    if (!allowed.length === !forbidden.length){
      return next(Error('authRequired middleware incorrect config'));
    }

    // Works only if there are no allowed and there are forbidden links

    if((!allowed.length && forbidden.indexOf(req.url) === -1) || (allowed.indexOf(req.url) > -1 && !forbidden.length)) {
      try {
        // TODO May be better to get this from cookies?
        const {refreshToken} = req.body;

        // TODO I don't know how to do it right yet
        const tokens = await userService.refreshToken(refreshToken);
        req.jwt = tokens;
        next();

      } catch (e) {
        next(e);
      }
    } else {
      next();
    }
  }
}

module.exports = refresherToken;