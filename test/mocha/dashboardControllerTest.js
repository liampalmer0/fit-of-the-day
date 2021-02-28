const { expect } = require('chai');
const proxyquire = require('proxyquire');
const { Outfit } = require('../../api/recommender');

const USERNAME = 'tester';
const DEFAULT_ZIPCODE = 10001;
const ZIPCODE = '60605';
const CITY = 'Chicago';
const sinon = require('sinon');

let dashboardCtrl;
let recRandStub;
let recommendStub;
let findOneUserStub;
let findOneOutfitStub;
let createOutfitStub;
let updateOutfitStub;
let getCurrentWeatherStub;

describe('DashboardController', function () {
  beforeEach(function () {
    recRandStub = sinon.stub();
    recommendStub = sinon.stub();
    findOneUserStub = sinon.stub();
    findOneOutfitStub = sinon.stub();
    createOutfitStub = sinon.stub();
    updateOutfitStub = sinon.stub();
    getCurrentWeatherStub = sinon.stub();

    dashboardCtrl = proxyquire('../../controller/dashboardController.js', {
      '../api/recommender': {
        recRand: recRandStub,
        recommend: recommendStub
      },
      '../sequelize': {
        models: {
          user: { findOne: findOneUserStub },
          outfit: {
            create: createOutfitStub,
            update: updateOutfitStub,
            findOne: findOneOutfitStub
          }
        }
      },
      '../api/openWeatherMap': {
        getCurrentWeather: getCurrentWeatherStub
      }
    });
  });
  describe('#getApiResults()', function () {
    it('should return calendar data and weather data from session coords', async function () {
      let req = { session: { coords: { lat: 0.2347, lon: 2 } } };
      getCurrentWeatherStub.resolves({
        city: CITY,
        current: 75
      });

      const result = await dashboardCtrl.getApiResults(req);

      expect(getCurrentWeatherStub.calledWith(req.session.coords, true));
      expect(result.weather).to.deep.equal({ current: 75, city: CITY });
      expect(result.calStatus).to.deep.equal('No Events Today');
    });

    it('should return calendar data and weather data from saved zip code', async function () {
      let weather = {
        current: 75,
        city: CITY,
        coords: { lat: 0, lon: 1 }
      };
      let req = { session: { coords: null } };
      findOneUserStub.resolves({ dataValues: { zipcode: '60605' } });
      getCurrentWeatherStub.resolves(weather);

      const result = await dashboardCtrl.getApiResults(req);

      expect(findOneUserStub.calledOnce).to.be.true;
      expect(getCurrentWeatherStub.calledWith('60605')).to.be.true;
      expect(result.weather).to.deep.equal(weather);
      expect(result.calStatus).to.deep.equal('No Events Today');
    });

    it('should return calendar data and default zip code weather data', async function () {
      let req = { session: { coords: null } };
      let weather = {
        current: 75,
        city: CITY,
        coords: { lat: 0, lon: 1 }
      };
      findOneUserStub.resolves(null);
      getCurrentWeatherStub.resolves(weather);

      const result = await dashboardCtrl.getApiResults(req);

      expect(findOneUserStub.calledOnce).to.be.true;
      expect(getCurrentWeatherStub.calledWith(DEFAULT_ZIPCODE)).to.be.true;
      expect(result.weather).to.deep.equal(weather);
      expect(result.calStatus).to.deep.equal('No Events Today');
    });

    it('should return calendar data and weather error message', async function () {
      let req = { session: { coords: null } };
      findOneUserStub.resolves(null);
      getCurrentWeatherStub.throws();

      const result = await dashboardCtrl.getApiResults(req);

      expect(findOneUserStub.calledOnce).to.be.true;
      expect(getCurrentWeatherStub.calledWith(DEFAULT_ZIPCODE)).to.be.true;
      expect(result.weather).to.equal('Weather Unavailable');
      expect(result.calStatus).to.deep.equal('Calendar Unavailable');
    });
  });

  describe('#getZipCode()', function () {
    it("should return the zipcode for user 'tester'", async function () {
      findOneUserStub.resolves({ dataValues: { zipcode: '60605' } });

      const zip = await dashboardCtrl.getZipCode(USERNAME);

      expect(zip).to.equal(ZIPCODE);
      expect(findOneUserStub.calledOnce, 'Find one user not called once').to.be
        .true;
    });

    it('should return nothing if user does not exist', async function () {
      findOneUserStub.throws('Zip code error');

      const zip = await dashboardCtrl.getZipCode(USERNAME);

      expect(zip).to.equal(null);
      expect(findOneUserStub.calledOnce, 'Find one user not called once').to.be
        .true;
    });
  });

  describe('#regenRecommendations()', function () {
    it('gets recommended again then renders', async function () {
      const outfits = [new Outfit(-1), new Outfit(-1), new Outfit(-1)];
      let render = sinon.spy();
      recommendStub.resolves(outfits);

      await dashboardCtrl.regenRecommendations(
        {
          session: { username: USERNAME, temp: 75 }
        },
        { render }
      );

      expect(recommendStub.calledOnce, 'Recommend not called').to.be.true;
      expect(
        render.calledWith('includes/recommendations', { outfits: outfits })
      ).to.be.true;
    });
  });

  describe('#setFavorite()', function () {
    let req;
    let res;
    let next;
    beforeEach(function () {});
    afterEach(function () {
      findOneOutfitStub.reset();
      createOutfitStub.reset();
      updateOutfitStub.reset();
    });
    it('should set outfit as favorite if it already exists', async function () {
      req = { body: { base: 1, partner: 2, checked: true } };
      findOneOutfitStub.resolves({ dataValues: { favorite: false } });
      updateOutfitStub.resolves();
      let statusSpy = sinon.spy();
      res = { sendStatus: statusSpy };
      next = sinon.spy();

      await dashboardCtrl.setFavorite(req, res, next);

      expect(findOneOutfitStub.calledOnce, 'Find one outfit not called once').to
        .be.true;
      expect(
        updateOutfitStub.calledWith(
          { favorite: req.body.checked },
          {
            where: {
              articleArticleId: req.body.base,
              partnerArticleId: req.body.partner
            }
          }
        ),
        'Update outfit not called once'
      ).to.be.true;
      expect(res.sendStatus.calledWith(200)).to.be.true;
      expect(next.notCalled, 'Next called').to.be.true;
    });

    it('should create an outfit as favorite if it does not exist', async function () {
      req = { body: { base: 1, partner: 2, checked: true } };
      findOneOutfitStub.resolves(null);
      createOutfitStub.resolves();
      let statusSpy = sinon.spy();
      res = { sendStatus: statusSpy };
      next = sinon.spy();

      await dashboardCtrl.setFavorite(req, res, next);

      expect(findOneOutfitStub.calledOnce, 'Find one outfit not called once').to
        .be.true;
      expect(
        createOutfitStub.calledWith({
          articleArticleId: req.body.base,
          partnerArticleId: req.body.partner,
          favorite: req.body.checked
        })
      ).to.be.true;
      expect(res.sendStatus.calledWith(200)).to.be.true;
      expect(next.notCalled, 'Next called').to.be.true;
    });

    it('should call next() if there is an error', async function () {
      req = { body: { base: 1, partner: 2, checked: true } };
      findOneOutfitStub.throws('Set fav error');
      createOutfitStub.resolves();
      let statusSpy = sinon.spy();
      res = { sendStatus: statusSpy };
      next = sinon.spy();

      await dashboardCtrl.setFavorite(req, res, next);

      expect(findOneOutfitStub.calledOnce, 'Find one outfit not called once').to
        .be.true;
      expect(createOutfitStub.notCalled).to.be.true;
      expect(res.sendStatus.notCalled).to.be.true;
      expect(next.calledOnce, 'Next not called once').to.be.true;
    });
  });

  describe('#showDashboard()', function () {
    let session;
    let req;
    let next;
    beforeEach(function () {
      session = { username: USERNAME, opStatus: {} };
      req = { session, query: { id: 1 } };
      next = sinon.spy();
      findOneUserStub.resolves('60605');
      getCurrentWeatherStub.resolves({
        current: 75,
        coords: { lat: 1, lon: 1 }
      });
    });

    it('should render dashboard page with data from APIs', async function () {
      let render = sinon.spy();
      let res = { render: render };

      await dashboardCtrl.showDashboard(req, res, next);

      expect(next.notCalled).to.be.true;
      expect(
        render.calledWith('dashboard', {
          weather: { current: 75, coords: { lat: 1, lon: 1 } },
          calStatus: 'No Events Today',
          title: 'Fit of the Day - Dashboard',
          pagename: 'dashboard'
        }),
        'Render not called with given args'
      ).to.be.true;
    });

    it('should call next on error', async function () {
      let render = sinon.stub().throws();
      let res = { render: render };

      await dashboardCtrl.showDashboard(req, res, next);

      expect(render.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.true;
    });
  });

  describe('#regenFiltered()', function () {
    it('should return an array of outfits that match the given filters');
  });
});
