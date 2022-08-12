const {validationResult} = require('express-validator');
const UserService = require('../Services/userService');
const ApiError = require('../Exceptions/apiError');

class authController {
  async signup(req, res, next) {
    try {
      let errors = validationResult(req);
      let id_type = null;

      /* TODO refactoring validator, must be simple */
      if (errors.array().length === 2 || errors.array()[0].param === 'password') {
        return next(ApiError.BadRequest('ValidationError', errors.array()))
      } else {
        if (errors.array()[0].msg === 'Not email'){
          id_type = 'Phone';
        } else {
          id_type = 'Email';
        }
      }

      const {id, password} = req.body;
      const tokens = await UserService.signup(id, password, id_type);

      res.json({
        status: 'Signup success',
        JWT: tokens,
      });

    } catch (e) {
      next(e);
    }
  }

  async signin(req, res, next) {
    try {
      let errors = validationResult(req);
      if (errors.array().length === 2 || errors.array()[0].param === 'password') {
        return next(ApiError.BadRequest('ValidationError', errors.array()));
      }

      const {id, password} = req.body;
      const tokens = await UserService.signin(id, password);

      res.json({
        status: 'Signin success',
        JWT: tokens,
      });
    } catch (e) {
      next(e);
    }
  }

  async getUserData(req, res, next){

  }

  async logout(req, res, next){
    try{
      let errors = validationResult(req);
      if (errors.array().length) {
        return next(ApiError.BadRequest('ValidationError', errors.array()));
      }

      const {id, refresh_token, all} = req.body;

      if(all){
        await UserService.logoutByIdAll(id);
      } else {
        await UserService.logoutByTokenOne(refresh_token);
      }

      res.json({message: `Logout by ${all ? 'Id all RefreshTokens' : 'this RefreshToken'}`});
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new authController();