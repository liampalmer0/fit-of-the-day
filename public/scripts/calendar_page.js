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

function handlePopUp(popupName) {
  const dialog = document.querySelector(`.dialog[name='${popupName}']`);

  if (dialog.style.display === 'block') {
    dialog.style.display = 'none';
  } else {
    dialog.style.display = 'block';
  }
}

function closePopUp(e) {
  const dialog = e.target.parentElement.parentElement;
  dialog.style.display = 'none';
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

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // document.querySelector('.msg').innerHTML = this.responseText;
      console.log(this.responseText);
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
  elem.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      eventHandler(event);
    }
  });
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function eventDetailsPop(e) {
  handlePopUp('detailsPopup');

  let startDay = pad(e.schedule.start.getDay());
  let startMonth = pad(e.schedule.start.getMonth());
  let startYear = e.schedule.start.getFullYear();
  let startHour = pad(e.schedule.start.getHours());
  let startMinute = pad(e.schedule.start.getMinutes());

  let endDay = pad(e.schedule.end.getDay());
  let endMonth = pad(e.schedule.end.getMonth());
  let endYear = e.schedule.end.getFullYear();
  let endHour = pad(e.schedule.end.getHours());
  let endMinute = pad(e.schedule.end.getMinutes());

  let start = `${startYear}-${startMonth}-${startDay}`;
  let startTime = `${startHour}:${startMinute}`;
  let end = `${endYear}-${endMonth}-${endDay}`;
  let endTime = `${endHour}:${endMinute}`;

  document.querySelector('#nameDetails').value = e.schedule.title;
  document.querySelector('#descDetails').value = e.schedule.body;
  document.querySelector('#startDetails').value = start;
  document.querySelector('#endDetails').value = end;
  document.querySelector('#dressCodeDetails').value = e.schedule.calendarId;
  document.querySelector('#startTimeDetails').value = startTime;
  document.querySelector('#endTimeDetails').value = endTime;
}

cal.on({
  clickSchedule: function (e) {
    console.log('clickSchedule', e);
    eventDetailsPop(e);
  },
  beforeCreateSchedule: function (e) {
    console.log('beforeCreateSchedule', e);
    // open a creation popup
    handlePopUp('createPopup');
    // If you dont' want to show any popup, just use `e.guide.clearGuideElement()`

    // then close guide element(blue box from dragging or clicking days)
    e.guide.clearGuideElement();
  },
  beforeUpdateSchedule: function (e) {
    console.log('beforeUpdateSchedule', e);
    e.schedule.start = e.start;
    e.schedule.end = e.end;
    cal.updateSchedule(e.schedule.id, e.schedule.calendarId, e.schedule);
  },
  beforeDeleteSchedule: function (e) {
    console.log('beforeDeleteSchedule', e);
    cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
  }
});

function loadEvents() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      generateSchedule(JSON.parse(this.responseText));
    }
  };
  xhttp.open('GET', 'calendar/load?year=2021&month=3', true);
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

function findCalendar(id) {
  var found;

  CalendarList.forEach(function (calendar) {
    if (calendar.id === id) {
      found = calendar;
    }
  });

  return found || CalendarList[0];
}

(function () {
  var calendar;
  var id = 0;

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'My Calendar';
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

function hideDelete() {
  dialog.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  let a = document.querySelector('#calendarSave');
  let close = document.querySelector('#detailClose');
  let cancel = document.querySelector('#createCancel');
  addClickHandlers(a, saveEvent);
  addClickHandlers(close, closePopUp);
  addClickHandlers(cancel, closePopUp);
  loadEvents();
});
