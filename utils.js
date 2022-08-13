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

  await userService._createUserAuthTable();
  await tokenService._createTokenTable();
  console.log('Databases cleared');
}

async function tokenCleaner(){
  /*
    Database Cleaner for old refresh tokens from DB.
    It cleans at program startup and every 24 hours
  */

  await tokenService.deleteOldTokens();
  console.log('Old records removed from the tokenDB');

  setInterval(async () => {
    await tokenService.deleteOldTokens();
    console.log('Old records removed from the tokenDB');
  },86400000);
}

module.exports = {resetDatabases, tokenCleaner}