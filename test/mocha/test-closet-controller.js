const assert = require('assert');
const controller = require('../../controller/closetController');

const username = 'lamp';
describe('Closet Controller', () => {
  describe('#getArticles(username)', () => {
    it("should return all articles for user 'lamp'", async () => {
      const articles = await controller.getArticles(username);
      assert.strictEqual(articles.length, 22);
    });
  });
  // describe('#showCloset', function () {
  //   it('should return the closet page');
  // });
});
