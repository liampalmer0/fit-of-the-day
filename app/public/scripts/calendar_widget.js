function updateNavRefs(prevIdx, nextIdx) {
  let prev = document.querySelector(".event-controls button[name='prev']");
  let next = document.querySelector(".event-controls button[name='next']");
  prev.attributes.dest.value = prevIdx;
  next.attributes.dest.value = nextIdx;
}

function goNext(e) {
  let destination = parseInt(e.target.attributes.dest.value);
  let current = destination <= 1 ? 0 : destination - 1;
  show(current, destination, (res) => {
    if (res) {
      updateNavRefs(current, destination + 1);
    }
  });
}

function goPrev(e) {
  let destination = parseInt(e.target.attributes.dest.value);
  let current = destination + 1;
  show(current, destination, (res) => {
    if (res) {
      updateNavRefs(destination - 1, current);
    }
  });
}

function show(hide, show, cb) {
  if (hide !== show) {
    let tohide = document.querySelector(`.event[index='${hide}']`);
    let toshow = document.querySelector(`.event[index='${show}']`);
    if (tohide && toshow) {
      tohide.style.display = 'none';
      toshow.style.display = 'grid';
      cb(true);
    } else {
      cb(false);
    }
  }
}

function setupControls() {
  const events = document.querySelectorAll('.event');
  if (events.length !== 0) {
    const prev = document.querySelector(".event-controls button[name='prev']");
    const next = document.querySelector(".event-controls button[name='next']");
    prev.addEventListener('click', (e) => {
      goPrev(e);
    });
    next.addEventListener('click', (e) => {
      goNext(e);
    });
  }
}

function getEvents() {
  const parent = document.querySelector('.cal-widget').parentNode;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      parent.innerHTML = this.responseText;
      setupControls();
    }
  };
  xhttp.open('GET', 'calendar/events', true);
  xhttp.send();
}

document.addEventListener('DOMContentLoaded', () => {
  getEvents();
});
