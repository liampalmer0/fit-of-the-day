function setFavoriteListeners() {
  const favs = document.querySelectorAll('.favorite');
  favs.forEach((node) => {
    handlePress(node, ajaxSetFavorite);
  });
}
function ajaxRecommend() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      document.querySelector('.recommendations').innerHTML = this.responseText;
      setFavoriteListeners();
    } else if (this.readyState === 4 && this.status !== 200) {
      document.querySelector('.recommendations').innerHTML =
        '<p class="error">Error: Recommendations Unavailable</p>';
    }
  };
  xhttp.open('GET', 'dashboard/recommend', true);
  xhttp.send();
}
function ajaxSetFavorite(e) {
  const ids = e.target.value.split(',');
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status !== 200) {
      e.target.checked = false;
    }
  };
  xhttp.open('POST', 'dashboard/favorite', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(`base=${ids[0]}&partner=${ids[1]}&checked=${e.target.checked}`);
}

function showHideFilter() {
  let filters = document.querySelector('.filter > form');
  if (filters.style.display === 'flex') {
    filters.style.display = 'none';
  } else {
    filters.style.display = 'flex';
  }
}

function setupButtons() {
  handlePress(
    document.querySelector("button[name='regenerate']"),
    ajaxRecommend
  );
  handlePress(document.querySelector("button[name='filter']"), showHideFilter);
}

function handlePress(elem, action) {
  elem.addEventListener('click', (e) => {
    action(e);
  });
  elem.addEventListener('keydown', (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      action(e);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupButtons();
  ajaxRecommend();
});
