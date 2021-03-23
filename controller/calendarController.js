const { models } = require('../sequelize');
const { Op } = require('sequelize');
const DRESS_CODES = ['casual', 'semi-formal', 'formal'];

async function getEvents(username, begin = null, end = null) {
  try {
    let where = {};
    if (begin && end) {
      where = { dateTimeStart: { [Op.between]: [begin, end] } };
    }
    return await models.event.findAll({
      include: {
        attributes: ['userId'],
        model: models.user,
        where: { username },
        required: true
      },
      where: where,
      order: [['dateTimeStart', 'ASC']]
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    return [];
  }
}

async function loadEvents(req, res, next) {
  let start = new Date(req.query.year, req.query.month - 1, 1, 0, 0, 0);
  let end = new Date(req.query.year, req.query.month, 0, 23, 59, 59);
  let events = await getEvents(req.session.username, start, end);

  res.send(events);
}

async function getCalendarFrag(req, res) {
  let locals = {};
  try {
    const username = req.session.username;
    let now = new Date();
    let eod = new Date(now.toUTCString());
    eod.setHours(23, 59, 59);
    const events = await getEvents(username, now, eod);
    let stripped = [];
    if (events.length === 0) {
      locals = { events: null, empty: true, msg: 'No Events Today' };
    } else {
      for (let i = 0; i < events.length; i++) {
        let ev = events[i];
        let start = new Date(ev.dataValues.dateTimeStart);
        let end = new Date(ev.dataValues.dateTimeEnd);
        let timeOpt = { hour: '2-digit', minute: '2-digit' };
        stripped.push({
          index: i,
          name: ev.dataValues.name,
          desc: ev.dataValues.desc,
          dressCode: DRESS_CODES[ev.dataValues.dressCodeId - 1],
          start: {
            day: start.getDate(),
            month: start.getMonth(),
            year: start.getFullYear(),
            time: start.toLocaleTimeString(['en-US'], timeOpt)
          },
          end: {
            day: end.getDate(),
            month: end.getMonth(),
            year: end.getFullYear(),
            time: end.toLocaleTimeString(['en-US'], timeOpt)
          }
        });
      }
      locals = { events: stripped, empty: false, error: false };
    }
  } catch (err) {
    locals = { events: false, empty: false, error: true };
  }
  res.render('includes/calendar-widget', locals);
}

async function saveEvent(req, res) {
  let user = await models.user.findOne({
    attributes: ['userId'],
    where: { username: req.session.username }
  });
  await models.event.create({
    userId: user.userId,
    name: req.body.name,
    desc: req.body.desc,
    dressCodeId: req.body.dressCode,
    dateTimeStart: req.body.start,
    dateTimeEnd: req.body.end
  });
  res.send('The event was saved.');
}

module.exports = {
  getEvents,
  getCalendarFrag,
  saveEvent,
  loadEvents
};
