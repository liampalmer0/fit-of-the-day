document.addEventListener('DOMContentLoaded', () => {
  getLocation(updateWeather);
  addGeolocateBtnListener();
});

function getLocation(callback) {
  navigator.geolocation.getCurrentPosition((position) => {
    callback(position);
  });
}
function updateWeather(position) {
  const parent = document.querySelector('.widgets div');
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      parent.innerHTML = this.responseText;
    }
  };
  xhttp.open('POST', 'weather/locate', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(
    `lon=${position.coords.longitude}&lat=${position.coords.latitude}`
  );
}

function addGeolocateBtnListener() {
  // set up manual geolocation request from button with id
  document.querySelector('#locate-me').addEventListener('click', () => {
    getLocation(updateWeather);
  });
}
