const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Outfit = require('../../common/Outfit');

const USERNAME = 'tester';

let closetCtrl;
let findOneClosetStub;
let updateArticlesStub;
let getArticlesStub;
describe('Closet Controller', function () {
  beforeEach(function () {
    findOneClosetStub = sinon.stub();
    updateArticlesStub = sinon.stub();
    getArticlesStub = sinon.stub();

    closetCtrl = proxyquire('../../controller/closetController.js', {
      '../sequelize': {
        models: {
          article: {
            update: updateArticlesStub
          },
          closet: {
            findOne: findOneClosetStub
          }
        }
      }
    });
  });
  describe('#getCloset', function () {
    it("should return the closet for user 'tester'", async function () {
      findOneClosetStub.resolves({ dataValues: { closetId: 1 } });
      const closet = await closetCtrl.getCloset(USERNAME);
      expect(closet).to.be.an('object');
      expect(closet).to.have.property('dataValues');
      expect(closet.dataValues.closetId).to.be.equal(1);
    });
  });

  describe('#createWhere', function () {
    it('should create an empty where clause from empty filters', function () {
      const where = closetCtrl.createWhere({});
      expect(Object.keys(where)).to.have.lengthOf(0);
    });

    it('should create an empty where clause from default filters', function () {
      const where = closetCtrl.createWhere({
        color: '',
        type: '',
        dresscode: '',
        dirty: '',
        tempMin: '-15',
        tempMax: '120'
      });
      expect(Object.keys(where)).to.have.lengthOf(2);
      expect(where).to.have.all.keys(['tempMin', 'tempMax']);
    });

    it('should create a where clause', function () {
      const color = 'red';
      const type = '1';
      const dresscode = '3';
      const dirty = 't';
      const tempMin = '50';
      const tempMax = '100';
      const where = closetCtrl.createWhere({
        color: color,
        type: type,
        dresscode: dresscode,
        dirty: dirty,
        tempMin: tempMin,
        tempMax: tempMax
      });
      expect(Object.keys(where)).to.have.lengthOf(6);
      expect(where).to.deep.property('color', color);
      expect(where).to.deep.property('garmentTypeId', type);
      expect(where).to.deep.property('dressCodeId', dresscode);
      expect(where).to.deep.property('dirty', dirty);
      expect(where).to.have.property('tempMin');
      expect(where).to.have.property('tempMax');
    });
  });

  describe('#showCloset', function () {
    let session;
    let req;
    beforeEach(function () {
      session = { username: USERNAME, opStatus: {} };
      req = { session, file: null, query: {} };
    });

    it("should render the closet page with all of a closet's articles", async function () {
      let partners = [
        { dataValues: { articleId: 3, outfit: { favorite: true } } },
        { dataValues: { articleId: 4, outfit: { favorite: false } } }
      ];
      let articles = [{ dataValues: { articleId: 1, partner: partners } }];
      getArticlesStub.resolves(articles);
      findOneClosetStub.resolves({ getArticles: getArticlesStub });
      let render = sinon.spy();
      let res = { render: render };

      await closetCtrl.showCloset(req, res);

      expect(findOneClosetStub.calledOnce, 'Find one closet not called once').to
        .be.true;
      expect(getArticlesStub.calledTwice, 'Get articles not called once').to.be
        .true;
      expect(
        render.calledWith('closet', {
          title: 'FOTD - Closet',
          pagename: 'closet',
          success: undefined,
          error: undefined,
          articles: articles,
          outfits: [new Outfit(articles[0], partners[0], true)],
          tab: 'articles'
        })
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: false,
        error: false
      });
    });

    it('should render the closet page with error on error', async function () {
      findOneClosetStub.throws('Get Closet Error');
      let render = sinon.spy();
      let res = { render: render };

      await closetCtrl.showCloset(req, res);

      expect(findOneClosetStub.calledOnce, 'Find one closet not called once').to
        .be.true;
      expect(
        render.calledWith('closet', {
          title: 'FOTD - Closet - Error',
          pagename: 'closet',
          success: false,
          error: { msg: 'Closet data unavailable. Please try again later.' }
        })
      ).to.be.true;
      expect(req.session.opStatus).to.deep.equal({
        success: false,
        error: false
      });
    });
  });

  describe('#filterCloset', function () {
    let session;
    let req;
    beforeEach(function () {
      session = { username: USERNAME, opStatus: {} };
      req = { session, file: null };
    });

    it("should render a filtered set of a closet's articles", async function () {
      let articles = [{ dataValues: { name: 'filteredArticle' } }];
      getArticlesStub.resolves(articles);
      findOneClosetStub.resolves({ getArticles: getArticlesStub });
      let render = sinon.spy();
      let res = { render: render };

      await closetCtrl.filterCloset(req, res);

      expect(findOneClosetStub.calledOnce, 'Find one closet not called once').to
        .be.true;
      expect(getArticlesStub.calledOnce, 'Get articles not called once').to.be
        .true;
      expect(
        render.calledWith('includes/closet-articles', {
          articles: articles
        })
      ).to.be.true;
    });

    it('should render closet articles with no data', async function () {
      findOneClosetStub.throws('Filter Error');
      let render = sinon.spy();
      let res = { render: render };

      await closetCtrl.filterCloset(req, res);

      expect(findOneClosetStub.calledOnce, 'Find one closet not called once').to
        .be.true;
      expect(render.calledWith('includes/closet-articles')).to.be.true;
    });
  });

  describe('#laundryDay', function () {
    let session;
    let req;
    beforeEach(function () {
      session = { username: USERNAME, opStatus: {} };
      req = { session, file: null };
    });

    it("should update all of a closet's articles to be clean", async function () {
      updateArticlesStub.resolves();
      findOneClosetStub.resolves({ dataValues: { closetId: 1 } });
      let redirect = sinon.spy();
      let res = { redirect: redirect };

      await closetCtrl.laundryDay(req, res);

      expect(findOneClosetStub.calledOnce, 'Find one closet not called once').to
        .be.true;
      expect(updateArticlesStub.calledOnce, 'Get articles not called once').to
        .be.true;
      expect(redirect.calledWith(`/${USERNAME}/closet`)).to.be.true;
      expect(req.session.opStatus).to.be.deep.equal({
        success: { msg: "All articles set to 'clean'" },
        error: false
      });
    });

    it('should set session error on error and render closet', async function () {
      updateArticlesStub.throws('Laundry Day Error');
      findOneClosetStub.resolves({ dataValues: { closetId: 1 } });
      let redirect = sinon.spy();
      let res = { redirect: redirect };

      await closetCtrl.laundryDay(req, res);

      expect(findOneClosetStub.calledOnce, 'Find one closet not called once').to
        .be.true;
      expect(updateArticlesStub.calledOnce, 'Update articles not called once')
        .to.be.true;
      expect(redirect.calledWith(`/${USERNAME}/closet`)).to.be.true;
      expect(req.session.opStatus).to.be.deep.equal({
        success: false,
        error: { msg: 'Closet update failed' }
      });
    });
  });
});
