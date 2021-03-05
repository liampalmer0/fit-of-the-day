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

function handlePopUp() {
  const dialog = document.querySelector('.dialog');

  if (dialog.style.display === 'block') {
    dialog.style.display = 'none';
  } else {
    dialog.style.display = 'block';
  }
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
      document.querySelector('.msg').innerHTML = this.responseText;
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

cal.on({
  clickSchedule: function (e) {
    console.log('clickSchedule', e);
  },
  beforeCreateSchedule: function (e) {
    console.log('beforeCreateSchedule', e);
    // open a creation popup
    handlePopUp();
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

function newEvent() {
  calelendar.createSchedule({
    id: 1,
    calelendarId: userId.toString(),
    title: '',
    start: '',
    end: '',
    isAllDay: false,
    color: '',
    bgColor: '',
    dressCodeId: ''
    //dateTimeStart: '',
    //dateTimeEnd: ''
  });
}

function editEvent() {
  calendar.updateSchedule(schedule.id, schedule.calendarId, {
    title: '',
    start: '',
    end: '',
    isAllDay: false,
    color: '',
    bgColor: ''
  });
}

function deleteEvent() {
  calendar.deleteSchedule(schedule.id, schedule.calendarId);
}

document.addEventListener('DOMContentLoaded', () => {
  let a = document.querySelector('#calendarSave');
  addClickHandlers(a, saveEvent);
});
