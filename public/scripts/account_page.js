function zipCodeUpdate(zip) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      document.querySelector('.msg').innerHTML = this.responseText;
    }
  };
  xhttp.open('POST', 'account/zip', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(`zip=${zip}`);
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
