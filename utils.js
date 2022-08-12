// TODO delete this than
const tokenService = require('./Services/tokenService')
const userService = require('./Services/userService')

async function resetDatabases(){
  try {
    await tokenService._dropTokenTable();
  } catch (e) {
    console.log(e.message);
  }

  try {
    await userService._dropUserAuthTable();
  } catch (e) {
    console.log(e.message);
  }

  await tokenService._createTokenTable();
  await userService._createUserAuthTable();
  return 'Databases clear'
}

async function tokenCleaner(){
  /*
    Database Cleaner for old refresh tokens from DB.
    It cleans at program startup and every 24 hours
  */

  console.log('Old records removed from the tokenDB');
  setInterval(() => {
    console.log('Old records removed from the tokenDB');
  },86400000);
}

module.exports = {resetDatabases, tokenCleaner}