function showTopBottomCards() {
  const tb = document.querySelector('div.topbtm');
  const single = document.querySelector('div.single');
  // show tops & bottoms
  tb.style.display = 'grid';
  let fieldsets = tb.querySelectorAll('fieldset');
  fieldsets[0].removeAttribute('disabled');
  fieldsets[1].removeAttribute('disabled');
  // hide singles
  single.style.display = 'none';
  single.querySelector('fieldset').setAttribute('disabled', 'disabled');
}
function showSingleCards() {
  const tb = document.querySelector('div.topbtm');
  const single = document.querySelector('div.single');
  // show singles
  single.style.display = 'grid';
  single.querySelector('fieldset').removeAttribute('disabled');
  // hide tops & bottoms
  tb.style.display = 'none';
  let fieldsets = tb.querySelectorAll('fieldset');
  fieldsets[0].setAttribute('disabled', 'disabled');
  fieldsets[1].setAttribute('disabled', 'disabled');
}
function handleSectionDropdown() {
  const tbTab = document.querySelector('.controls > button#tb');
  const singleTab = document.querySelector('.controls > button#single');
  tbTab.addEventListener('click', () => {
    tbTab.setAttribute('current', 'true');
    singleTab.setAttribute('current', 'false');
    showTopBottomCards();
  });
  singleTab.addEventListener('click', () => {
    singleTab.setAttribute('current', 'true');
    tbTab.setAttribute('current', 'false');
    showSingleCards();
  });
}
function handleCardClicks() {
  let cards = document.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => {
      cards[i].querySelector("input[type='radio']").checked = true;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  handleSectionDropdown();
  handleCardClicks();
});
