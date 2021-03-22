const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const USERNAME = 'tester';
const START_DATE = new Date('2021-01-01Z00:00:00');

let calCtrl;
let findAllEventsStub;
let mockedEventData;

describe('Calendar Controller', function () {
  beforeEach(function () {
    findAllEventsStub = sinon.stub();

    calCtrl = proxyquire('../../controller/calendarController.js', {
      '../sequelize': {
        models: {
          event: {
            findAll: findAllEventsStub
          }
        }
      }
    });

    mockedEventData = [
      {
        dataValues: {
          dateTimeStart: new Date().toString(),
          dateTimeEnd: new Date().toString(),
          name: 0,
          desc: 0,
          dressCodeId: 1,
          eventId: 0,
          user: 0,
          userId: 0
        }
      }
    ];
  });

  describe('#getEvents()', function () {
    it("should return all events for user 'tester'", async function () {
      findAllEventsStub.resolves(mockedEventData);
      const allEvents = await calCtrl.getEvents(USERNAME);
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
      const rangedEvents = await calCtrl.getEvents(
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

      const rangedEvents = await calCtrl.getEvents(USERNAME);

      expect(rangedEvents).to.be.an('array');
      expect(rangedEvents).to.have.lengthOf(0);
      expect(findAllEventsStub.calledOnce).to.be.true;
    });
  });

  describe('#getCalendarFrag()', function () {
    it('should render calendar widget with event data', async function () {
      let req = { session: { username: USERNAME } };
      let render = sinon.spy();
      let res = { render: render };
      findAllEventsStub.resolves(mockedEventData);
      let start = new Date(mockedEventData[0].dataValues.dateTimeStart);
      let end = new Date(mockedEventData[0].dataValues.dateTimeEnd);

      await calCtrl.getCalendarFrag(req, res);

      expect(
        render.calledWith('includes/calendar-widget', {
          events: [
            {
              index: 0,
              name: mockedEventData[0].dataValues.name,
              desc: mockedEventData[0].dataValues.desc,
              dressCode: 'casual',
              start: {
                day: start.getDate(),
                month: start.getMonth(),
                year: start.getFullYear(),
                hour: start.getHours(),
                minute: start.getMinutes()
              },
              end: {
                day: end.getDate(),
                month: end.getMonth(),
                year: end.getFullYear(),
                hour: end.getHours(),
                minute: end.getMinutes()
              }
            }
          ],
          empty: false,
          error: false
        })
      ).to.be.true;
    });

    it('should render calendar empty message when no events', async function () {
      let req = { session: { username: USERNAME } };
      let render = sinon.spy();
      let res = { render: render };
      findAllEventsStub.resolves([]);

      await calCtrl.getCalendarFrag(req, res);

      expect(
        render.calledWith('includes/calendar-widget', {
          events: null,
          empty: true,
          msg: 'No Events Today'
        })
      ).to.be.true;
    });
  });
});
