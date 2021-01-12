const deleteBtn = document.querySelector('#deleteBtn');
const dialog = document.querySelector('.dialog');
const close = document.querySelector('.close');
const cancel = document.querySelector('.cancel');

// Show delete dialog
function showDelete() {
  if (dialog.style.display === '' || dialog.style.display === 'none') {
    dialog.style.display = 'block';
  }
}
// Hide delete dialog
function hideDelete() {
  dialog.style.display = 'none';
}
// Add eventHandlers to elem for mouse click and keyboard input events
function addClickHandlers(elem, eventHandler) {
  elem.addEventListener('click', () => {
    eventHandler();
  });
  // handler for space bar and enter key
  elem.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      eventHandler();
    }
  });
}

function setupBtnHandlers() {
  addClickHandlers(deleteBtn, showDelete);
  addClickHandlers(close, hideDelete);
  addClickHandlers(cancel, hideDelete);
  // Hide dialog if click outside of dialog
  window.onclick = function (event) {
    if (event.target === dialog) {
      dialog.style.display = 'none';
    }
  };
}

window.onload = function () {
  setupBtnHandlers();
};
