const { expect } = require('chai');
const controller = require('../../controller/articleController');

const username = 'tester';
describe('Article Controller', function () {
  describe('#getArticle(articleId, username)', function () {
    it('should return data on article with id === 1', async function () {
      const rows = await controller.getArticle(1, username);
      expect(rows[0].dataValues.name).to.equal('Green Shirt');
      expect(rows[0].dataValues.color).to.equal('green');
    });
  });

  describe('#getArticle(articleId, username): Incorrect username', function () {
    it('should return no rows', async function () {
      const rows = await controller.getArticle(1, 'notTester');
      expect(rows).to.be.empty;
    });
  });

  describe('#getClosetId(username)', function () {
    it("should return the closet id for user 'tester'", async function () {
      const closetId = await controller.getClosetId(username);
      expect(closetId).to.equal(1);
    });
  });

  describe('#categoricalToId(type, dresscode) bottom & casual', function () {
    it('should return array with values [2, 1]', async function () {
      const ids = controller.categoricalToId('bottom', 'casual');
      expect(ids[0]).to.equal(2);
      expect(ids[1]).to.equal(1);
    });
  });

  // describe('#createArticle', function () {
  //   it('should do something');
  // });

  // describe('#editArticle', function () {
  //   it('should do something');
  // });

  // describe('#deleteArticle', function () {
  //   it('should do something');
  // });
});
