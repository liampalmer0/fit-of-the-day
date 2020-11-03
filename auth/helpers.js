const bcrypt = require('bcryptjs');

async function compareHash(userPassword, databasePassword) {
  return await bcrypt.compare(userPassword, databasePassword);
}

module.exports = {
  compareHash,
};
