const ApiError = require('../Exceptions/apiError');
const TokenService = require('../Services/tokenService');

/*
  You can only choose 1 setting for middleware:
  - Array of allowed urls (forbidden all links except allowed)
      or
  - Array of forbidden urls (allow all links except exceptions)
*/
const authRequired = ({allowed = [], forbidden = []}) => {
  return (req, res, next) => {
    // Check correct configuration
    if (!allowed.length === !forbidden.length){
      return next(Error('authRequired middleware incorrect config'));
    }

    // Works only if there are no allowed and there are forbidden links
    if((!allowed.length && forbidden.indexOf(req.url) === -1) || (allowed.indexOf(req.url) > -1 && !forbidden.length)){
      try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
          return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
          return next(ApiError.UnauthorizedError());
        }

        const userData = TokenService.validateAccessToken(accessToken);
        if(!userData){
          return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();

      } catch (e) {
        return next(ApiError.UnauthorizedError());
      }
    } else {
      next();
    }
  }
}

module.exports = authRequired;