const minTempSlider = document.getElementById('tempMin');
const maxTempSlider = document.getElementById('tempMax');
const minTemp = document.getElementById('minval');
const maxTemp = document.getElementById('maxval');
const submit = document.querySelector("input[type='submit']");
const tempAlert = document.querySelector('.tempAlert');

function check(min, max) {
  if (parseInt(min) > parseInt(max)) {
    submit.disabled = true;
    tempAlert.style.display = 'block';
  } else {
    submit.disabled = false;
    tempAlert.style.display = 'none';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  minTemp.innerHTML = minTempSlider.value;
  maxTemp.innerHTML = maxTempSlider.value;
  // update the slider val on change
  minTempSlider.oninput = function () {
    minTemp.innerHTML = this.value;
    check(minTemp.innerHTML, maxTemp.innerHTML);
  };
  maxTempSlider.oninput = function () {
    maxTemp.innerHTML = this.value;
    check(minTemp.innerHTML, maxTemp.innerHTML);
  };
});
