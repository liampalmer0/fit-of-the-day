const { USERNAME, PASSWORD } = require('../constants');

module.exports = {
  'step one: log in': function (browser) {
    browser
      .url('http://localhost:3000/login')
      .waitForElementVisible('body')
      .assert.titleContains('FOTD - Login')
      .setValue('input#username', USERNAME)
      .setValue('input#password', PASSWORD)
      .submitForm('form#loginform')
      .assert.visible('nav.internal');
  },
  'step two: go to create article form': function (browser) {
    browser
      .waitForElementVisible("a[name='closet']")
      .pause(500)
      .click("a[name='closet']")
      .assert.titleContains('FOTD - Closet')
      .waitForElementVisible('link text', 'New Article')
      .pause(500)
      .click('css selector', "a[id='newArticle']")
      .assert.titleContains('FOTD - Create Article')
      .assert.containsText('h1', 'Create New Article');
  },
  'step three: create new article': function (browser) {
    browser
      .waitForElementVisible('form#articleForm')
      .pause(500)
      .setValue("input[id='name']", 'testArticle')
      .setValue('select#color', 'blue')
      .setValue('select#type', 'bottom')
      .setValue('select#dressCode', 'formal')
      .submitForm('form#articleForm');
  },
  'step four: validate new article': function (browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('FOTD - testArticle')
      .assert.visible('p.success')
      .assert.containsText('p.success', 'New article created successfully')
      .end();
    //TODO: rollback creation
  }
};
