module.exports = {
  'navigate to FOTD homepage': function (browser) {
    browser
      .init()
      .waitForElementVisible('body')
      .assert.titleContains('Fit of the Day - Welcome')
      .assert.visible('div.scroller')
      .assert.containsText('nav', 'Sign in')
      .assert.containsText('nav', 'Sign Up');
  }
};
