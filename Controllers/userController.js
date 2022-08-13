const Ping = require('ping-lite');
const TokenService = require('../Services/tokenService')

class userController {
  getUserInfo (req, res, next) {
    try{
      const newTokens = req.jwt;
      const userData = TokenService.getDataFromRefresh(req.jwt.refreshToken);
      res.json({message: '/info', userData, newTokens});
    } catch (e) {
      next(e);
    }
  }

  getLatency (req, res, next) {
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
  }
}

module.exports = new userController();