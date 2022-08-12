const bcrypt = require('bcryptjs');
const db = require('./configDB');
const {validationResult} = require('express-validator');
const TokenService = require('./Services/tokenService');

class authController {
  async signup(req, res) {
    try {
      let errors = validationResult(req);
      let id_type = null;

      /* TODO refactoring validator, must be simple */
      if (errors.array().length === 2 || errors.array()[0].param === 'password') {
        console.log('Errors: ', errors.array());
        res.json({error: errors}).status(400);
        return;
      } else {
        if (errors.array()[0].msg === 'Not email'){
          id_type = 'Phone';
        } else {
          id_type = 'Email';
        }
      }

      console.log('id_type', id_type);
      console.log('req.body', req.body);

      const {id, password} = req.body;

      const checkId = await db.execute(`SELECT * FROM userAuth WHERE person_id = '${id}';`);
      if (checkId[0].length){
        console.log();
        res.json({error: 'We have already same Id user:' + checkId[0]});
        return;
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const createUserSQL = `INSERT INTO userAuth (person_id, person_password, id_type) VALUES ('${id}', '${hashPassword}', '${id_type}');`
      await db.execute(createUserSQL);

      const checkUser = await db.execute(`SELECT * FROM userAuth WHERE person_id='${id}';`);
      console.log('checkUser', checkUser[0]);
      const user = checkUser[0][0];
      const token = TokenService.generateAccessToken(user.person_id, user.id_type);
      res.json({
        status: 'Signup success',
        JWT: token,
      });

    } catch (e) {
      console.log(e);
    }
  }

  async signin(req, res) {
    try {
      let errors = validationResult(req);
      if (errors.array().length === 2 || errors.array()[0].param === 'password') {
        console.log('Errors: ', errors.array());
        res.json({error: errors}).status(400);
        return;
      }

      const {id, password} = req.body;
      const checkUser = await db.execute(`SELECT * FROM userAuth WHERE person_id='${id}';`);

      if (!checkUser[0].length){
        res.json({message: 'User not found!'}).status(400);
        return;
      }

      const user = checkUser[0][0];

      const validPassword = await bcrypt.compare(password, user.person_password);
      if (!validPassword){
        res.json({message: 'Password incorrect'}).status(400);
        return;
      }
      const token = TokenService.generateAccessToken(user.person_id, user.id_type);
      res.json({
        status: 'Signin success',
        JWT: token,
      });
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = new authController();