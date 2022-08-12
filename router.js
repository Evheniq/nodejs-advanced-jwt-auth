const Router = require('express');
const router = new Router();
const authController = require('./Controllers/authController');
const {check} = require('express-validator');
const Ping = require ('ping-lite');

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
  const newTokens = req.jwt
  res.json({message: '/info', newTokens});
});

router.route('/latency').get((req, res, next) => {
      try{
        const newTokens = req.jwt;

        // Old lib way. Work ideal
        const ping = new Ping('google.com');

        ping.send(function(err, ms) {
          res.json({message: '/latency', latency: ms+' ms.', newTokens});
        });

        /*
         AXIOS way. Work not ideal

         const timeBefore = Date.now();
         const getGoogle = await axios.post('https://google.com');
         const timeAfter = Date.now();

         const latency = getGoogle.status === 200 ? timeAfter - timeBefore + ' ms' : 'Error connection to Google';
         res.json({message: '/latency', latency, newTokens});
        */

      } catch (e) {
        next(e);
      }
    });

router.route('/logout')
  .get([
    check('id', 'Id is empty').notEmpty(),
    check('refresh_token', 'Refresh Token is empty').notEmpty(),
    check('all', '"All" param is empty').notEmpty()
  ], authController.logout);

module.exports = router;