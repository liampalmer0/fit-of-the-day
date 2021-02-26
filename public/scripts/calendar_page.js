/*eslint-disable*/
var Calendar = tui.Calendar;

var cal = new Calendar('#calendar', {
  defaultView: 'month',
  taskView: true,
  template: {
    monthDayname: function (dayname) {
      return (
        '<span class="calendar-week-dayname-name">' + dayname.label + '</span>'
      );
    }
  }
});
