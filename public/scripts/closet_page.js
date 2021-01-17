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

function setupSliders() {
  let sliderMin = document.getElementById('tempMin');
  let outputMin = document.getElementById('minVal');
  outputMin.innerHTML = sliderMin.value;

  sliderMin.oninput = function () {
    outputMin.innerHTML = this.value;
  };

  let sliderMax = document.getElementById('tempMax');
  let outputMax = document.getElementById('maxVal');
  outputMax.innerHTML = sliderMax.value;

  sliderMax.oninput = function () {
    outputMax.innerHTML = this.value;
  };
}

function loadDoc() {
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

window.onload = function () {
  handleDivButtons();
  setupSliders();
  document
    .querySelector('#submitFilters')
    .addEventListener('click', (event) => {
      event.preventDefault();
      loadDoc();
    });
};
