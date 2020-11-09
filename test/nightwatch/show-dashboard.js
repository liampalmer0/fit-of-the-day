module.exports = {
  'step one: navigate to FOTD homepage': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body')
      .assert.titleContains('Fit of the Day - Welcome')
      .assert.visible('div.carousel')
      .assert.containsText('nav', 'Sign in')
      .assert.containsText('nav', 'Sign Up');
  },
};
