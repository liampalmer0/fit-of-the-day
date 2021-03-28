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
      setDirtyListeners();
    } else if (this.readyState === 4 && this.status !== 200) {
      document.querySelector('.recommendations').innerHTML =
        '<p class="error">Error: Recommendations Unavailable</p>';
    }
  };
  xhttp.open('GET', 'dashboard/recommend', true);
  xhttp.send();
}
function ajaxSetFavorite(e) {
  const before = e.target.attributes.favorite;
  const ids = e.target.value.split(',');
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (before) {
        e.target.removeAttribute('favorite');
      } else {
        e.target.setAttribute('favorite', 'favorite');
      }
    }
  };
  xhttp.open('POST', 'dashboard/favorite', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(`base=${ids[0]}&partner=${ids[1]}&checked=${!before}`);
}
function setDirtyListeners() {
  document.querySelectorAll('button.dirty').forEach((b) => {
    handlePress(b, ajaxSetDirty);
  });
}

function ajaxSetDirty(e) {
  const before = e.target.attributes.dirty;
  const id = e.target.value;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      if (before) {
        e.target.removeAttribute('dirty');
      } else {
        e.target.setAttribute('dirty', 'dirty');
      }
    }
  };
  xhttp.open('GET', `dashboard/dirty?articleId=${id}&checked=${before}`, true);
  xhttp.send();
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
  ajaxRecommend();
  setupButtons();
});
