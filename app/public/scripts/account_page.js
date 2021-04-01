function zipCodeUpdate(zip) {
  if (zip && zip.length !== 0) {
    let msg = document.querySelector('span.msg');
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        msg.classList.add('ok');
        msg.classList.remove('bad');
        document.querySelector('.msg').innerHTML = '&#10003;';
      } else if (this.readyState === 4 && this.status === 500) {
        msg.classList.add('bad');
        msg.classList.remove('ok');
        document.querySelector('.msg').innerHTML = '&times;';
      }
    };
    xhttp.open('POST', 'account/zip', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`zip=${zip}`);
  }
}

function addZipListener() {
  document
    .querySelector('#submitZipCode')
    .addEventListener('click', (event) => {
      event.preventDefault();
      zipCodeUpdate(document.querySelector('#zipCodeInput').value);
    });
}
document.addEventListener('DOMContentLoaded', () => {
  addZipListener();
});
