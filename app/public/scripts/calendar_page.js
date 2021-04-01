/*eslint-disable*/
var Calendar = tui.Calendar;

var cal = new Calendar('#calendar', {
  defaultView: 'month',
  taskView: true,
  useCreationPopup: false,
  useDetailPopup: false,
  template: {
    monthDayname: function (dayname) {
      return (
        '<span class="calendar-week-dayname-name">' + dayname.label + '</span>'
      );
    }
  }
});

function fillDetails(schedule) {
  let dresscodes = ['Casual', 'Semi-formal', 'Formal'];
  let calColors = ['#d49ae0', '#9ae0d4', '#9aa6e0'];
  //set top line color
  document.querySelector('.tui-full-calendar-popup-top-line').style.background =
    calColors[schedule.calendarId - 1];
  // set title
  document.querySelector(
    '.dialog .tui-full-calendar-schedule-title'
  ).innerHTML = schedule.title;
  // set desc
  document.querySelector('.tui-full-calendar-content.desc').innerHTML =
    schedule.body;
  // set dress code
  document.querySelector(
    '.tui-full-calendar-icon.tui-full-calendar-calendar-dot'
  ).style.background = calColors[schedule.calendarId - 1];
  document.querySelector('.tui-full-calendar-content.dresscode').innerHTML =
    dresscodes[schedule.calendarId - 1];
  // set time/date
  document.querySelector(
    '.tui-full-calendar-popup-detail-date.tui-full-calendar-content'
  ).innerHTML =
    schedule.start.getFullYear() +
    '.' +
    pad(schedule.start.getMonth() + 1) +
    '.' +
    pad(schedule.start.getDate()) +
    ' ' +
    schedule.start
      .toDate()
      .toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit' }) +
    ' - ' +
    schedule.end.getFullYear() +
    '.' +
    pad(schedule.end.getMonth() + 1) +
    '.' +
    pad(schedule.end.getDate()) +
    ' ' +
    schedule.end
      .toDate()
      .toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit' });
}

function fillCreate(day) {
  document.querySelector('#start').value = `${day.start.getFullYear()}-${pad(
    day.start.getMonth() + 1
  )}-${pad(day.start.getDate())}`;
  document.querySelector('#startTime').value = `${pad(
    day.start.getHours()
  )}:${pad(day.start.getMinutes())}`;

  document.querySelector('#end').value = `${day.end.getFullYear()}-${pad(
    day.end.getMonth() + 1
  )}-${pad(day.end.getDate())}`;
  document.querySelector('#endTime').value = `${pad(day.end.getHours())}:${pad(
    day.end.getMinutes()
  )}`;
}
function handlePopUp(popupName, e) {
  const dialog = document.querySelector(`.dialog[name='${popupName}']`);

  if (dialog.style.display === 'block') {
    dialog.style.display = 'none';
  } else {
    dialog.style.display = 'block';
  }

  if (popupName === 'createPopup') {
    fillCreate(e);
  } else if (popupName === 'detailsPopup') {
    fillDetails(e.schedule);
  }
}

function closeParentPopUp(e) {
  const dialog = e.target.parentElement.parentElement;
  dialog.style.display = 'none';
  document.querySelector('#name').value = '';
  document.querySelector('#desc').value = '';
  document.querySelector('#start').value = '';
  document.querySelector('#end').value = '';
  document.querySelector('#dressCode').value = '';
  document.querySelector('#startTime').value = '';
  document.querySelector('#endTime').value = '';
}

function saveEvent() {
  let name = document.querySelector('#name').value;
  let desc = document.querySelector('#desc').value;
  let startDate = document.querySelector('#start').value;
  let endDate = document.querySelector('#end').value;
  let dressCode = document.querySelector('#dressCode').value;
  let startTime = document.querySelector('#startTime').value;
  let endTime = document.querySelector('#endTime').value;

  let start = `${startDate} ${startTime}`;
  let end = `${endDate} ${endTime}`;

  var schedule = new ScheduleInfo();
  schedule.id = '';
  schedule.calendarId = dressCode;
  schedule.title = name;
  schedule.body = desc;
  schedule.category = 'time';
  schedule.start = start;
  schedule.end = end;

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      cal.createSchedules([schedule]);
      handlePopUp('createPopup');
      name.value = '';
      desc.value = '';
      start.value = '';
      end.value = '';
      dressCode.value = '';
      startTime.value = '';
      endTime.value = '';
    }
  };
  xhttp.open('POST', 'calendar/newEvent', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(
    `name=${name}&desc=${desc}&dressCode=${dressCode}&start=${start}&end=${end}`
  );
}

function addClickHandlers(elem, eventHandler) {
  elem.addEventListener('click', (e) => {
    eventHandler(e);
  });
  // handler for space bar and enter key
  elem.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      eventHandler(e);
    }
  });
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function eventDetailsPop(e) {
  handlePopUp('detailsPopup', e);
}

cal.on({
  clickSchedule: function (e) {
    // console.log('clickSchedule', e);
    eventDetailsPop(e);
  },
  beforeCreateSchedule: function (e) {
    // console.log('beforeCreateSchedule', e);
    // open a creation popup
    handlePopUp('createPopup', e);
    // If you dont' want to show any popup, just use `e.guide.clearGuideElement()`
    // then close guide element(blue box from dragging or clicking days)
    e.guide.clearGuideElement();
  },
  beforeUpdateSchedule: function (e) {
    // console.log('beforeUpdateSchedule', e);
    e.schedule.start = e.start;
    e.schedule.end = e.end;
    cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
  },
  beforeDeleteSchedule: function (e) {
    // console.log('beforeDeleteSchedule', e);
    cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
  }
});

function loadEvents() {
  let now = new Date();
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      generateSchedule(JSON.parse(this.responseText));
    }
  };

  xhttp.open(
    'GET',
    'calendar/load?year=' +
      now.getFullYear() +
      '&month=' +
      (now.getMonth() + 1),
    true
  );
  xhttp.send();
}

function ScheduleInfo() {
  this.id = null;
  this.calendarId = null;

  this.title = null;
  this.body = null;
  this.isAllday = false;
  this.start = null;
  this.end = null;
  this.category = '';
  this.dueDateClass = '';
  this.dressCodeId = '';

  this.color = null;
  this.bgColor = null;
  this.dragBgColor = null;
  this.borderColor = null;
  this.customStyle = '';

  this.isFocused = false;
  this.isPending = false;
  this.isVisible = true;
  this.isReadOnly = false;
  this.goingDuration = 0;
  this.comingDuration = 0;
  this.recurrenceRule = '';
  this.state = '';

  this.raw = {
    memo: '',
    hasToOrCc: false,
    hasRecurrenceRule: false,
    location: null,
    class: 'public', // or 'private'
    creator: {
      name: '',
      avatar: '',
      company: '',
      email: '',
      phone: ''
    }
  };
}

var CalendarList = [];

function CalendarInfo() {
  this.id = null;
  this.name = null;
  this.checked = true;
  this.color = null;
  this.bgColor = null;
  this.borderColor = null;
  this.dragBgColor = null;
}

function addCalendar(calendar) {
  CalendarList.push(calendar);
}

(function () {
  var calendar;
  var id = 0;

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Casual';
  calendar.color = '#000000';
  calendar.bgColor = '#d49ae0';
  calendar.dragBgColor = '#d49ae0';
  calendar.borderColor = '#d49ae0';
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Semi-Formal';
  calendar.color = '#000000';
  calendar.bgColor = '#9ae0d4';
  calendar.dragBgColor = '#9ae0d4';
  calendar.borderColor = '#9ae0d4';
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Formal';
  calendar.color = '#000000';
  calendar.bgColor = '#9aa6e0';
  calendar.dragBgColor = '#9aa6e0';
  calendar.borderColor = '#9aa6e0';
  addCalendar(calendar);
})();

function generateSchedule(data) {
  ScheduleList = [];

  data.forEach((event) => {
    var schedule = new ScheduleInfo();
    schedule.id = event.eventId;
    schedule.calendarId = event.dressCodeId;
    schedule.title = event.name;
    schedule.body = event.desc;
    schedule.category = 'time';
    schedule.start = event.dateTimeStart;
    schedule.end = event.dateTimeEnd;
    schedule.dressCodeId = event.dressCodeId;

    ScheduleList.push(schedule);
  });
  cal.createSchedules(ScheduleList);
  refreshScheduleVisibility();
}

document.addEventListener('DOMContentLoaded', () => {
  addClickHandlers(document.querySelector('#calendarSave'), saveEvent);
  addClickHandlers(document.querySelector('#detailClose'), closeParentPopUp);
  addClickHandlers(document.querySelector('#createCancel'), closeParentPopUp);
  loadEvents();
});
