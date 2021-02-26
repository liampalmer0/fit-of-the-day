const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const USERNAME = 'tester';
let articleCtrl;
let getClosetStub;
let findOneStub;
let updateStub;
let deleteStub;
let unlinkStub;
describe('Article Controller', function () {
  beforeEach(function () {
    getClosetStub = sinon.stub();
    findOneStub = sinon.stub();
    updateStub = sinon.stub();
    deleteStub = sinon.stub();
    unlinkStub = sinon.stub();

    articleCtrl = proxyquire('../../controller/articleController.js', {
      '../sequelize': {
        models: {
          article: {
            update: updateStub,
            destroy: deleteStub,
            findOne: findOneStub
          }
        }
      },
      './closetController': { getCloset: getClosetStub },
      fs: {
        unlink: unlinkStub
      }
    });
  });
  describe('#getArticle(articleId, username)', function () {
    it('should return data on article with id === 1', async function () {
      let getArticleStub = sinon
        .stub()
        .resolves([{ dataValues: { id: 1, name: 'Green Shirt' } }]);
      getClosetStub.resolves({ getArticles: getArticleStub });

      const rows = await articleCtrl.getArticle(1, USERNAME);

      expect(rows[0].dataValues.id).to.equal(1);
      expect(rows[0].dataValues.name).to.equal('Green Shirt');
      expect(getArticleStub.calledOnce).to.be.true;
      expect(getClosetStub.calledOnce).to.be.true;
      getArticleStub.reset();
      getClosetStub.reset();
    });
    it('should return no rows for bad username', async function () {
      getClosetStub.resolves(null);

      const rows = await articleCtrl.getArticle(1, 'notTester');

      expect(rows, `Rows length = ${rows.length}; Expected 0`).to.be.empty;
      expect(getClosetStub.calledOnce).to.be.true;
      getClosetStub.reset();
    });
    it('should return no rows for bad id', async function () {
      let getArticleStub = sinon.stub().throws();
      getClosetStub.resolves({ getArticles: getArticleStub });

      const rows = await articleCtrl.getArticle(-40, 'tester');

      expect(rows, `Rows length = ${rows.length}; Expected 0`).to.be.empty;
      expect(getClosetStub.calledOnce).to.be.true;
      expect(getArticleStub.calledOnce).to.be.true;
      getArticleStub.reset();
      getClosetStub.reset();
    });
  });

  describe('#createArticle', function () {
    let session;
    let body;
    let req;
    beforeEach(function () {
      session = { username: USERNAME };
      body = {
        name: 'test article',
        desc: 'test desc',
        dirty: 'f',
        type: 'top',
        dressCode: 'casual',
        color: '#0F0F5F',
        tempMin: 65,
        tempMax: 90
      };
      req = { session, body, file: null };
    });

    it('should create a new article', async function () {
      let created = { dataValues: { articleId: 1 } };
      let createArticleStub = sinon.stub().resolves(created);
      getClosetStub.resolves({ createArticle: createArticleStub });
      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.createArticle(req, res);

      expect(createArticleStub.calledOnce, 'Create article not called once').to
        .be.true;
      expect(
        redirect.calledWith(
          `/${USERNAME}/closet/article?id=${created.dataValues.articleId}`
        )
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: { msg: 'Article created successfully' },
        error: false
      });
    });

    it('should set session error on error', async function () {
      let createArticleStub = sinon.stub().throws('CreateArticleErr');
      getClosetStub.resolves({ createArticle: createArticleStub });
      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.createArticle(req, res);

      expect(createArticleStub.calledOnce, 'Create article not called once').to
        .be.true;
      expect(redirect.calledWith(`/${USERNAME}/closet`)).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: false,
        error: { msg: 'Article creation failed' }
      });
    });
  });

  describe('#editArticle', function () {
    let session;
    let query;
    let body;
    let req;
    beforeEach(function () {
      session = { username: USERNAME };
      query = { id: 1 };
      body = {
        name: 'test article',
        desc: 'test desc',
        dirty: 't',
        type: 'top',
        dressCode: 'casual',
        color: '#FFF0EF',
        tempMin: 65,
        tempMax: 90
      };
      req = { session, body, file: null, query };
    });
    afterEach(function () {
      updateStub.reset();
    });
    it('should edit the article', async function () {
      updateStub.resolves();
      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.editArticle(req, res);

      expect(updateStub.calledOnce, 'Update was not called').to.be.true;
      expect(
        redirect.calledWith(`/${USERNAME}/closet/article?id=${req.query.id}`)
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: { msg: 'Article updated successfully' },
        error: false
      });
    });

    it('should set session error on error', async function () {
      updateStub.throws('EditArticleErr');
      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.editArticle(req, res);

      expect(updateStub.calledOnce, 'Update was not called').to.be.true;
      expect(
        redirect.calledWith(`/${USERNAME}/closet/article?id=${req.query.id}`)
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: false,
        error: { msg: 'Article update failed' }
      });
    });
  });

  describe('#deleteArticle', function () {
    let session = { username: USERNAME };
    let query = { id: 1 };
    let req = { session, query };
    it('should delete the article', async function () {
      findOneStub.resolves(null);
      deleteStub.resolves();

      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.deleteArticle(req, res);

      expect(deleteStub.calledOnce, 'Delete was not called').to.be.true;
      expect(findOneStub.calledOnce, 'Delete Image was not called').to.be.true;
      expect(redirect.calledWith(`/${USERNAME}/closet`)).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: { msg: 'Article deleted successfully' },
        error: false
      });
    });

    it('should set session error on error', async function () {
      findOneStub.resolves(null);
      deleteStub.throws();

      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.deleteArticle(req, res);

      expect(deleteStub.calledOnce, 'Delete was not called').to.be.true;
      expect(
        redirect.calledWith(`/${USERNAME}/closet/article?id=${req.query.id}`)
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: false,
        error: { msg: 'Article deletion failed' }
      });
    });
    it('should set session error on error', async function () {
      findOneStub.throws();
      deleteStub.resolves();

      let redirect = sinon.spy();
      let res = { redirect };

      await articleCtrl.deleteArticle(req, res);

      expect(findOneStub.calledOnce, 'Delete Image was not called').to.be.true;
      expect(deleteStub.notCalled, 'Delete was called').to.be.true;
      expect(
        redirect.calledWith(`/${USERNAME}/closet/article?id=${req.query.id}`)
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: false,
        error: { msg: 'Article deletion failed' }
      });
    });
  });

  describe('#showArticle', function () {
    it('should do something');
  });

  describe('#showCreate', function () {
    it('should do something');
  });

  describe('#showEdit', function () {
    it('should do something');
  });
});
