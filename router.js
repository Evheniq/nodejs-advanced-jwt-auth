const Router = require('express');
const router = new Router();
const authController = require('./authController');
const {check} = require('express-validator');
const tokenService = require('./Services/tokenService')

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

router.route('/info').get((req, res) => {
  res.json({message: '/info'});
});

router.route('/latency').get((req, res) => {
  res.json({message: '/latency'});
});

router.route('/logout').get((req, res) => {
  res.json({message: '/logout'});

});

module.exports = router;