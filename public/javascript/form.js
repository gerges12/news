window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    console.log(sticky) ;
    console.log(window.pageYOffset) ;
  } else {
    header.classList.remove("sticky");
  }
}