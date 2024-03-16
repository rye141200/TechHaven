/** Element selection */
const loginTabEl = document.querySelector(".login-tab");
const signupTabEl = document.querySelector(".signup-tab");
const boxEl = document.querySelector(".box");

//Tabbed element listener
boxEl.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("tab")) {
    e.target.classList.add("active-tab");
    e.target.classList.remove("inactive-tab");
    const closest = [...e.target.closest(".box").querySelectorAll(".tab")];
    closest.forEach((tab) => {
      if (tab != e.target) {
        tab.classList.add("inactive-tab");
        tab.classList.remove("active-tab");
      }
    });
    //TODO
  }
});
