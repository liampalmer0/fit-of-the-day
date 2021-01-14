const { expect } = require('chai');
const controller = require('../../controller/closetController');

const username = 'tester';
describe('Closet Controller', function () {
  describe('#getArticles(username)', function () {
    it("should return all articles for user 'tester'", async function () {
      const articles = await controller.getArticles(username);
      expect(articles.length).to.equal(19);
    });
  });
});
