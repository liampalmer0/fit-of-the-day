const { expect } = require('chai');
const sinon = require('sinon');
const { Outfit } = require('../../api/recommender');
let recr;
const proxyquire = require('proxyquire');

const USERNAME = 'tester';
const START_DATE = new Date('2021-01-01Z00:00:00');
const DEFAULT_DC = [1, 2, 3];
const DEFAULT_GT = [1, 2, 3];
const BASE = { dataValues: { name: 'base', garmentTypeId: 1 } };
const PARTNER = { dataValues: { name: 'partner', garmentTypeId: 2 } };
const SINGLE = { dataValues: { name: 'One Piece', garmentTypeId: 3 } };
const DB_OUTFITS = [
  {
    dataValues: {
      garmentTypeId: 1,
      partner: [
        {
          dataValues: { garmentTypeId: 2 },
          outfit: { dataValues: { favorite: true } }
        }
      ]
    }
  },
  {
    dataValues: {
      garmentTypeId: 3,
      partner: [
        {
          dataValues: { garmentTypeId: 3 },
          outfit: { dataValues: { favorite: true } }
        }
      ]
    }
  },
  {
    dataValues: {
      garmentTypeId: 1,
      partner: [
        {
          dataValues: { garmentTypeId: 2 },
          outfit: { dataValues: { favorite: true } }
        }
      ]
    }
  }
];
const COMPLETE_OUTFITS = require('../json/complete_outfits');
const ARTICLES = [
  { dataValues: { garmentTypeId: 1 } },
  { dataValues: { garmentTypeId: 1 } },
  { dataValues: { garmentTypeId: 1 } }
];
const PARTIAL_OUTFITS = [
  new Outfit(SINGLE, null, true),
  new Outfit(BASE, PARTNER, true),
  new Outfit(-1)
];
const EMPTY_OUTFITS = [new Outfit(-1), new Outfit(-1), new Outfit(-1)];

describe('Recommender', function () {
  let getArticlesStub;
  let findAllEventsStub;
  let sequelizeLitStub;

  beforeEach(function () {
    getArticlesStub = sinon.stub();
    findAllEventsStub = sinon.stub();
    sequelizeLitStub = sinon.stub();

    recr = proxyquire('../../api/recommender.js', {
      '../sequelize': {
        models: {
          event: {
            findAll: findAllEventsStub
          }
        },
        Sequelize: { literal: sequelizeLitStub }
      },
      '../controller/closetController': {
        getCloset: sinon.stub().resolves({ getArticles: getArticlesStub })
      }
    });
  });

  describe('#getRandomByType()', function () {
    it('should return article(s) matching given type');
  });

  describe('#recRand()', function () {
    beforeEach(function () {
      sequelizeLitStub.returnsArg(0);
    });
    afterEach(function () {
      sequelizeLitStub.reset();
    });
    it("should return array of 3 outfits for the user 'tester'", async function () {
      getArticlesStub.resolves(ARTICLES);
      const outfits = await recr.recRand(USERNAME);
      expect(outfits).to.have.lengthOf(3);
      expect(outfits[0]).to.have.all.keys('top', 'bottom');
    });
    it('should return 0 on error', async function () {
      getArticlesStub.throws('RecRand Err');
      const outfits = await recr.recRand(USERNAME);
      expect(outfits).to.equal(0);
    });
  });

  describe('#recRandFiltered() **DEPRECATED**', function () {
    it('should return outfit array matching given filters');
  });

  describe('#getEvents()', function () {
    let mockedEventData;
    beforeEach(function () {
      mockedEventData = [
        {
          dataValues: {
            dateTimeEnd: 0,
            dateTimeStart: 0,
            desc: 0,
            dressCodeId: 0,
            eventId: 0,
            name: 0,
            user: 0,
            userId: 0
          }
        }
      ];
    });
    it("should return all events for user 'tester'", async function () {
      findAllEventsStub.resolves(mockedEventData);
      const allEvents = await recr.getEvents(USERNAME);
      expect(allEvents).to.have.lengthOf(1);
      expect(allEvents[0].dataValues).to.have.all.keys(
        'dateTimeEnd',
        'dateTimeStart',
        'desc',
        'dressCodeId',
        'eventId',
        'name',
        'user',
        'userId'
      );
      expect(findAllEventsStub.calledOnce).to.be.true;
    });

    it("should return all events between start & end for user 'tester'", async function () {
      findAllEventsStub.resolves(mockedEventData);
      const rangedEvents = await recr.getEvents(
        USERNAME,
        START_DATE,
        Date.now()
      );
      expect(rangedEvents).to.have.lengthOf(1);
      expect(rangedEvents[0].dataValues).to.have.all.keys(
        'dateTimeEnd',
        'dateTimeStart',
        'desc',
        'dressCodeId',
        'eventId',
        'name',
        'user',
        'userId'
      );
      expect(findAllEventsStub.calledOnce).to.be.true;
    });

    it('should return empty on error', async function () {
      findAllEventsStub.throws('Get events error');

      const rangedEvents = await recr.getEvents(USERNAME);

      expect(rangedEvents).to.be.an('array');
      expect(rangedEvents).to.have.lengthOf(0);
      expect(findAllEventsStub.calledOnce).to.be.true;
    });
  });

  describe('#Outfit Object', function () {
    it('create object with properties base, partner and favorite', function () {
      const outfit = new Outfit(BASE, PARTNER, true);
      expect(outfit).to.have.all.keys('base', 'partner', 'favorite');
      expect(outfit.base).to.deep.equal(BASE);
      expect(outfit.partner).to.deep.equal(PARTNER);
      expect(outfit.favorite).to.be.true;
    });

    it('create object with identical base & partner for single piece outfits', function () {
      const outfit = new Outfit(BASE);
      expect(outfit).to.have.all.keys('base', 'partner', 'favorite');
      expect(outfit.base).to.deep.equal(BASE);
      expect(outfit.partner).to.deep.equal(BASE);
      expect(outfit.favorite).to.be.false;
    });
  });

  describe('#recParams()', function () {
    it('should generate a default where clause', function () {
      const where = recr.recParams();

      const and = Object.getOwnPropertySymbols(where).find(function (s) {
        return String(s) === 'Symbol(and)';
      });
      const gte = Object.getOwnPropertySymbols(where[and][0].tempMax).find(
        function (s) {
          return String(s) === 'Symbol(gte)';
        }
      );
      const lte = Object.getOwnPropertySymbols(where[and][1].tempMin).find(
        function (s) {
          return String(s) === 'Symbol(lte)';
        }
      );
      expect(where).to.have.keys('dirty', 'garmentTypeId', 'dressCodeId', and);
      expect(where.garmentTypeId).to.deep.equal(DEFAULT_GT);
      expect(where.dressCodeId).to.deep.equal(DEFAULT_DC);
      expect(where[and][0].tempMax[gte]).to.be.eq(75);
      expect(where[and][1].tempMin[lte]).to.be.eq(75);
    });

    it('should generate a where clause from parameters', function () {
      const temp = 30;
      const dc = [1, 3];
      const garm = [2];
      const where = recr.recParams(temp, dc, garm);

      const and = Object.getOwnPropertySymbols(where).find(function (s) {
        return String(s) === 'Symbol(and)';
      });
      const gte = Object.getOwnPropertySymbols(where[and][0].tempMax).find(
        function (s) {
          return String(s) === 'Symbol(gte)';
        }
      );
      const lte = Object.getOwnPropertySymbols(where[and][1].tempMin).find(
        function (s) {
          return String(s) === 'Symbol(lte)';
        }
      );

      expect(where).to.have.keys('dirty', 'garmentTypeId', 'dressCodeId', and);
      expect(where.dirty).to.be.eq('f');
      expect(where.dressCodeId).to.be.deep.eq(dc);
      expect(where.garmentTypeId).to.be.deep.eq(garm);
      expect(where[and][0].tempMax[gte]).to.be.eq(temp);
      expect(where[and][1].tempMin[lte]).to.be.eq(temp);
    });
  });

  describe('#fill()', function () {
    it('should fill in empty spaces in an Outfit array', async function () {
      getArticlesStub.resolves(ARTICLES);

      const filledOutfits = await recr.fill(PARTIAL_OUTFITS, {
        getArticles: getArticlesStub
      });

      expect(filledOutfits).to.have.lengthOf(3);
      expect(getArticlesStub.calledTwice).to.be.true;
      expect(filledOutfits[0]).to.deep.equal(PARTIAL_OUTFITS[0]);
      expect(filledOutfits[1]).to.deep.equal(PARTIAL_OUTFITS[1]);
      expect(filledOutfits[2]).to.deep.equal(
        new Outfit({ dataValues: { garmentTypeId: 1 } })
      );
    });
    it('should return -1 for whole outfit spaces it cannot fill', async function () {
      getArticlesStub.resolves([]);

      const filledOutfits = await recr.fill(PARTIAL_OUTFITS, {
        getArticles: getArticlesStub
      });

      expect(filledOutfits).to.have.lengthOf(3);
      expect(getArticlesStub.calledTwice).to.be.true;
      expect(filledOutfits[0]).to.deep.equal(PARTIAL_OUTFITS[0]);
      expect(filledOutfits[1]).to.deep.equal(PARTIAL_OUTFITS[1]);
      expect(filledOutfits[2]).to.deep.equal(PARTIAL_OUTFITS[2]);
    });
  });
  describe('#recommend()', function () {
    beforeEach(function () {
      findAllEventsStub.resolves([]);
    });
    afterEach(function () {
      findAllEventsStub.reset();
    });

    it('should return an array of 3 outfits that match the day', async function () {
      getArticlesStub.resolves(DB_OUTFITS);

      const outfits = await recr.recommend(USERNAME);

      expect(outfits).to.have.lengthOf(3);
      expect(outfits[0]).to.deep.equal(COMPLETE_OUTFITS[0]);
      expect(outfits[1]).to.deep.equal(COMPLETE_OUTFITS[1]);
      expect(outfits[2]).to.deep.equal(COMPLETE_OUTFITS[2]);
      expect(findAllEventsStub.calledOnce, 'getEvents() not calledOnce').is
        .true;
      expect(getArticlesStub.called, 'getArticles() not called').is.true;
    });
    it('should return an array of 3 empty outfits on error', async function () {
      getArticlesStub.throws();

      const outfits = await recr.recommend(USERNAME);

      expect(outfits).to.have.lengthOf(3);
      expect(outfits[0]).to.deep.equal(EMPTY_OUTFITS[0]);
      expect(outfits[1]).to.deep.equal(EMPTY_OUTFITS[1]);
      expect(outfits[2]).to.deep.equal(EMPTY_OUTFITS[2]);
      expect(findAllEventsStub.calledOnce, 'getEvents() not called').is.true;
      expect(getArticlesStub.called, 'getArticles() not called').is.true;
    });
  });
});
