window.onload = function () {
  console.log('on');
  var ddBtn = document.querySelector("div[name='moreDropdown']");
  var ddContent = document.querySelector('.ddcontent');
  // on mouse over more link
  // show drop down menu
  // if not visible
  //  add css class show ({display: block | inline | etc})
  ddBtn.addEventListener('mouseover', (event) => {
    ddContent.classList.toggle('show');
    console.log('toggle show');
    console.log(ddContent.classList);
  });
  // on mouse off more or dropdown menu
  // if visible
  //  add css class hide ({display: none})

  console.log(ddContent);
};

function toggleVisibility(elem) {
  elem.classList.toggle('show');
}
// document
