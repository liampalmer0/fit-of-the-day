var assert = require('assert');
const controller = require('../../controller/closetController');

const username = 'lamp';
describe('Closet Controller', function () {
  describe('#getArticles(username)', function () {
    it("should return all articles for user 'lamp'", async function () {
      let articles = await controller.getArticles(username);
      assert.strictEqual(articles.length, 22);
    });
  });
  // describe('#showCloset', function () {
  //   it('should return the closet page');
  // });
});
