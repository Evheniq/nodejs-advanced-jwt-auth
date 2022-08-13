const db = require('./configDB');
const ApiError = require('../Exceptions/apiError');
const bcrypt = require('bcryptjs');
const TokenService = require('./tokenService');

class UserService{
  async _createUserAuthTable() {
    const createTableSQL = `
      CREATE TABLE userAuth(
        person_id varchar(255) NOT NULL,
        person_password varchar(255) NOT NULL,
        id_type varchar(7) NOT NULL,
        PRIMARY KEY (person_id)
      );
    `;

    await db.execute(createTableSQL);

    const addIndexSQL = `
          CREATE INDEX person_id ON userAuth(person_id);
    `
    await db.execute(addIndexSQL);

    console.log('Table userAuth created');
  }

  async _dropUserAuthTable() {
    const dropTableSQL = `DROP TABLE userAuth;`

    await db.execute(dropTableSQL);
    console.log('Table usersAuth dropped');
  }

  async _checkUser(id){
    const checkId = await db.execute(`SELECT * FROM userAuth WHERE person_id = '${id}';`);
    return checkId[0][0];
  }

  async signup(id, password, id_type){
    const userInDb = await this._checkUser(id);
    if (userInDb){
      throw ApiError.BadRequest('We have already same Id user: ' + userInDb.person_id);
    }

    const hashPassword = bcrypt.hashSync(password, 7);

    const createUserSQL = `INSERT INTO userAuth (person_id, person_password, id_type) VALUES ('${id}', '${hashPassword}', '${id_type}');`
    await db.execute(createUserSQL);

    const checkUser = await this._checkUser(id);
    return TokenService.generateAccessToken(checkUser.person_id, checkUser.id_type);
  }

  async signin(id, password){
    const userInDb = await this._checkUser(id);

    if (!userInDb){
      throw ApiError.BadRequest('User not found!');
    }

    const validPassword = await bcrypt.compare(password, userInDb.person_password);
    if (!validPassword){
      throw ApiError.BadRequest('ValidationError: Password incorrect');
    }

    return TokenService.generateAccessToken(userInDb.person_id, userInDb.id_type);
  }

  async logoutByTokenOne(refreshToken){
    await TokenService.removeRefreshToken(refreshToken);
  }

  async logoutByIdAll(person_id){
    await TokenService.removeUserTokens(person_id);
  }

  async refreshToken(refreshToken){
    if(!refreshToken){
      throw ApiError.UnauthorizedError();
    }
    const userData = await TokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.findRefreshToken(refreshToken);
    if(!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const checkUser = await this._checkUser(userData.id);
    return TokenService.generateAccessToken(checkUser.person_id, checkUser.id_type, tokenFromDB.refresh_token);
  }
}

module.exports = new UserService();