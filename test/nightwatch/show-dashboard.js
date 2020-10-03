module.exports = {
  'step one: navigate to dashboard': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body')
      .assert.titleContains("Cher's Closet")
      .assert.visible('div.container')
      .assert.containsText('p.sticky', 'This is a placeholder');
  },
};
