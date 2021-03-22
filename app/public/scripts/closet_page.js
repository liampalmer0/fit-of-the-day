function handleCardClicks() {
  const articlePaths = document.querySelectorAll('.article > input');
  document.querySelectorAll('.article').forEach((article, i) => {
    article.addEventListener('click', () => {
      window.location.href += articlePaths[i].value;
    });
    article.addEventListener('keydown', (event) => {
      if (event.keyCode === 13 || event.keyCode === 32) {
        window.location.href += articlePaths[i].value;
      }
    });
  });
}

function handleFilterDropdown() {
  const arrow = document.querySelector('#viewFilter > span');
  const filters = document.querySelector('#filterForm');
  document.querySelector('#viewFilter').addEventListener('click', () => {
    if (filters.style.display === 'grid') {
      filters.style.display = 'none';
      arrow.innerHTML = '&darr;';
    } else {
      filters.style.display = 'grid';
      arrow.innerHTML = '&uarr;';
    }
  });
}

function setupSliders() {
  let slider = document.querySelectorAll('.sliderContainer input');
  let output = document.querySelectorAll('.sliderContainer span');
  for (let i = 0; i < slider.length; i++) {
    output[i].innerHTML = slider[i].value;

    slider[i].oninput = function () {
      output[i].innerHTML = this.value;
    };
  }
  document.querySelector('.filterForm').onreset = function () {
    output[0].innerHTML = '-15';
    output[1].innerHTML = '120';
  };
}

function postFilter() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      document.querySelector(
        'main article.articles'
      ).innerHTML = this.responseText;
      handleCardClicks();
    }
  };
  xhttp.open('POST', 'closet/filter', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(
    `color=${document.querySelector('#color').value}` +
      `&type=${document.querySelector('#type').value}` +
      `&dresscode=${document.querySelector('#dresscode').value}` +
      `&dirty=${document.querySelector('#dirty').value}` +
      `&tempMin=${document.querySelector('#tempMin').value}` +
      `&tempMax=${document.querySelector('#tempMax').value}`
  );
}
function switchTab(event) {
  let tabname = event.target.attributes.name.value;
  if (tabname === 'outfits' || tabname === 'articles') {
    let outfits = document.querySelector('article.outfits');
    let articles = document.querySelector('article.articles');
    if (tabname === 'outfits') {
      let articleTab = document.querySelector(".tab[name='articles']");
      articleTab.classList.remove('active');
      event.target.classList.add('active');
      outfits.style.display = 'grid';
      articles.style.display = 'none';
    } else if (tabname === 'articles') {
      let outfitTab = document.querySelector(".tab[name='outfits']");
      outfitTab.classList.remove('active');
      event.target.classList.add('active');
      outfits.style.display = 'none';
      articles.style.display = 'grid';
    }
  }
}
function setupTabs() {
  document.querySelectorAll('button.tab').forEach((tab) => {
    tab.addEventListener('click', (event) => {
      switchTab(event);
    });
  });
}

function setupAjax() {
  document
    .querySelector('#submitFilters')
    .addEventListener('click', (event) => {
      event.preventDefault();
      postFilter();
    });
}

window.onload = function () {
  handleCardClicks();
  handleFilterDropdown();
  setupSliders();
  setupAjax();
  setupTabs();
};
