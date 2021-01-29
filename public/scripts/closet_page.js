function handleDivButtons() {
  const articles = document.querySelectorAll('.article');
  const articlePaths = document.querySelectorAll('.article > input');
  for (let i = 0; i < articles.length; i++) {
    articles[i].addEventListener('click', () => {
      window.location.href += articlePaths[i].value;
    });
    articles[i].addEventListener('keydown', (event) => {
      if (event.keyCode === 13 || event.keyCode === 32) {
        window.location.href += articlePaths[i].value;
      }
    });
  }
}

function handleFilterDropdown() {
  const viewFilter = document.querySelector('#viewFilter');
  const arrow = document.querySelector('#viewFilter > span');
  const filters = document.querySelector('#filterForm');
  viewFilter.addEventListener('click', () => {
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
  let color = document.querySelector('#color').value;
  let dresscode = document.querySelector('#dresscode').value;
  let type = document.querySelector('#type').value;
  let tempMin = document.querySelector('#tempMin').value;
  let tempMax = document.querySelector('#tempMax').value;
  let dirty = document.querySelector('#dirty').value;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      document.querySelector('main').innerHTML = this.responseText;
      handleDivButtons();
    }
  };
  xhttp.open('POST', 'closet/filter', true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.send(
    `color=${color}&type=${type}&dresscode=${dresscode}` +
      `&dirty=${dirty}&tempMin=${tempMin}&tempMax=${tempMax}`
  );
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
  handleDivButtons();
  handleFilterDropdown();
  setupSliders();
  setupAjax();
};
