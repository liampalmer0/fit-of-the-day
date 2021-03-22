const fs = require('fs');
const data = JSON.parse(fs.readFileSync('keys.json', 'utf-8'));
const EMAIL = data.test.email;
const USERNAME = data.test.username;
const PASSWORD = data.test.password;

module.exports = {
  EMAIL,
  USERNAME,
  PASSWORD
};
