const Router = require('express');
const router = new Router();
const authController = require('./Controllers/authController');
const userController = require('./Controllers/userController');
const {check} = require('express-validator');

router.route('/signin')
  .post(
    [
      check('password', 'Password is empty').notEmpty(),
      check('id', 'Not email').notEmpty().isEmail(),
      check('id', 'Not phone number').isMobilePhone(),
    ], authController.signin
  );

router.route('/signup')
  .post(
    [
      check('password', 'Password is empty').notEmpty(),
      check('id', 'Not email').notEmpty().isEmail(),
      check('id', 'Not phone number').isMobilePhone(),
    ], authController.signup
  );

router.route('/info').get(userController.getUserInfo);

router.route('/latency').get(userController.getLatency);

router.route('/logout')
  .get([
    check('id', 'Id is empty').notEmpty(),
    check('refresh_token', 'Refresh Token is empty').notEmpty(),
    check('all', '"All" param is empty').notEmpty()
  ], authController.logout);

module.exports = router;