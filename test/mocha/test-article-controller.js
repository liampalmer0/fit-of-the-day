var assert = require('assert');
const controller = require('../../controller/articleController');

const username = 'lamp';
describe('Article Controller', function () {
  describe('#getArticle(article_id, username)', function () {
    it('should return data on article with id = 1', async function () {
      let rows = await controller.getArticle(1, username);
      assert.strictEqual(rows[0].dataValues.name, 'Green Shirt');
      assert.strictEqual(rows[0].dataValues.color, 'green');
    });
  });

  describe('#getClosetId(username)', function () {
    it("should return the closet_id for user 'lamp'", async function () {
      let closetId = await controller.getClosetId(username);
      assert.strictEqual(closetId, 4);
    });
  });

  // describe('#showArticle(req, res, next)', function () {
  //   it("should do something");
  // });

  // describe('#showCreate', function () {
  //   it('should do something');
  // });

  // describe('#createArticle', function () {
  //   it('should do something');
  // });

  // describe('#showEdit', function () {
  //   it('should do something');
  // });

  // describe('#editArticle', function () {
  //   it('should do something');
  // });

  // describe('#deleteArticle', function () {
  //   it('should do something');
  // });
});
