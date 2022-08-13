const db = require('./configDB');
const jwt = require('jsonwebtoken');

class TokenService{
  async _createTokenTable(){
    const createTokenTableSQL = `
        CREATE TABLE userToken(
          person_id varchar(255) NOT NULL,
          refresh_token varchar(255) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (person_id)
              REFERENCES userauth (person_id)
              ON DELETE CASCADE);
    `;

    await db.execute(createTokenTableSQL);
    console.log('Table userToken created');
  }

  async _dropTokenTable(){
    const createTokenTableSQL = `DROP TABLE userToken;`

    await db.execute(createTokenTableSQL);
    console.log('Table userToken dropped');
  }

  async generateAccessToken(id, id_type, update_token=false) {
    const payload = {
      id,
      id_type
    };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '10m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

    if(update_token){
      const updateTokenTableSQL = `UPDATE userToken SET refresh_token = '${refreshToken}' WHERE refresh_token = '${update_token}';`;
      await db.execute(updateTokenTableSQL);
    } else {
      const insertTokenTableSQL = `INSERT INTO userToken (person_id, refresh_token) VALUES ('${id}', '${refreshToken}');`;
      await db.execute(insertTokenTableSQL);
    }

    return {
      accessToken,
      refreshToken
    }
  }

  async removeRefreshToken(refresh_token) {
    const removeTokenSQL = `
        DELETE
        FROM userToken
        WHERE refresh_token = '${refresh_token}';
    `;
    await db.execute(removeTokenSQL);
  }

  async removeUserTokens(person_id) {
    const removeUserTokensSQL = `
        DELETE
        FROM userToken
        WHERE person_id = '${person_id}';
    `;
    await db.execute(removeUserTokensSQL);
  }

  validateAccessToken(token){
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token){
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findRefreshToken(token){
    const checkToken = await db.execute(`SELECT * FROM usertoken WHERE refresh_token = '${token}';`);
    return checkToken[0][0];
  }

  async deleteOldTokens(){
    await db.execute(`DELETE FROM usertoken WHERE created_at < now() - interval 30 DAY;`)
  }

  getDataFromRefresh(token){
    const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return {id: data.id, id_type: data.id_type};
  }
}

module.exports = new TokenService();