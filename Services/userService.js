const db = require('../configDB');

class UserService{
  async _createUserAuthTable() {
    const createTableSQL = `CREATE TABLE userAuth(
    person_id varchar(255),
    person_password varchar(255),
    id_type varchar(7)
  );`

    await db.execute(createTableSQL);
    console.log('Table userAuth created');
  }

  async _dropUserAuthTable() {
    const dropTableSQL = `DROP TABLE userAuth;`

    await db.execute(dropTableSQL);
    console.log('Table usersAuth dropped');
  }

  //  TODO add all SQL queries from authController
}

module.exports = new UserService();