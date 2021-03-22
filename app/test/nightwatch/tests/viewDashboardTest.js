const { USERNAME, PASSWORD } = require('../constants');
module.exports = {
  'step one: log in': function (browser) {
    browser
      .init()
      .waitForElementVisible('body')
      .pause(500)
      .click("a[name='signin'")
      .assert.titleContains('FOTD - Login')
      .setValue('input#username', USERNAME)
      .setValue('input#password', PASSWORD)
      .submitForm('form#loginform');
    //do something to verify dashboard; i.e. assert recommendations
  }
};
