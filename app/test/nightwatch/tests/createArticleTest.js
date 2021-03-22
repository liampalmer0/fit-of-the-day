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
      .waitForElementVisible("a[href='/tester/closet']")
      .pause(500)
      .click("a[href='/tester/closet']")
      .assert.titleContains('FOTD - Closet')
      .waitForElementVisible('link text', '+ Article')
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
      .setValue('input#color', '#0055ff')
      .setValue('select#type', 'btm')
      .setValue('select#dressCode', 'formal')
      .submitForm('form#articleForm');
  },
  'step four: validate new article': function (browser) {
    browser
      .waitForElementVisible('body')
      .assert.titleContains('FOTD - testArticle')
      .assert.visible('p.success')
      .assert.containsText('p.success', 'Article created successfully')
      .end();
    //TODO: rollback creation
  }
};
