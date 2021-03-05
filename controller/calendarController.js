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
        stripped.push({
          index: i,
          name: ev.dataValues.name,
          desc: ev.dataValues.desc,
          dressCode: DRESS_CODES[ev.dataValues.dressCodeId - 1],
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
        });
      }
      locals = { events: stripped, empty: false, error: false };
    }
  } catch (err) {
    locals = { events: false, empty: false, error: true };
  }
  res.render('includes/calendar-widget', locals);
}

module.exports = {
  getEvents,
  getCalendarFrag
};
