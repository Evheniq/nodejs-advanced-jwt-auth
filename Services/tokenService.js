const db = require('../configDB');
const jwt = require('jsonwebtoken');

class TokenService{
  async _createTokenTable(){
    const createTokenTableSQL = `CREATE TABLE userToken(
      person_id varchar(255),
      refresh_token varchar(255)
    );`

    await db.execute(createTokenTableSQL);
    console.log('Table userToken created');
  }

  async _dropTokenTable(){
    const createTokenTableSQL = `DROP TABLE userToken;`

    await db.execute(createTokenTableSQL);
    console.log('Table userToken dropped');
  }

  generateAccessToken = async (id, id_type) => {
    const payload = {
      id,
      id_type
    };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '10m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

    const showTokenTableSQL = `INSERT INTO userToken (person_id, refresh_token) VALUES ('${id}', '${refreshToken}');`
    await db.execute(showTokenTableSQL);

    return {
      accessToken,
      refreshToken
    }
  }
}

module.exports = new TokenService();