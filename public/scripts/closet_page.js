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
window.onload = function () {
  handleDivButtons();
};

var sliderMin = document.getElementById('temp_min');
var outputMin = document.getElementById('minVal');
outputMin.innerHTML = sliderMin.value;

sliderMin.oninput = function () {
  outputMin.innerHTML = this.value;
};

var sliderMax = document.getElementById('temp_max');
var outputMax = document.getElementById('maxVal');
outputMax.innerHTML = sliderMax.value;

sliderMax.oninput = function () {
  outputMax.innerHTML = this.value;
};
