const { expect } = require('chai');
const controller = require('../../controller/articleController');

const username = 'tester';
describe('Article Controller', function () {
  describe('#getArticle(articleId, username)', function () {
    it('should return data on article with id === 1', async function () {
      const rows = await controller.getArticle(1, username);
      expect(rows[0].dataValues.name).to.equal('Green Shirt');
    });
  });

  describe('#getArticle(articleId, username): Incorrect username', function () {
    it('should return no rows', async function () {
      const rows = await controller.getArticle(1, 'notTester');
      expect(rows).to.be.empty;
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
