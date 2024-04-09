"use strict";
const menuEl = document.querySelector(".menu-nav");
//*Menu button
menuEl.addEventListener("click", function () {
  const leftMenuEl = document.querySelector(".left-menu");
  leftMenuEl.classList.remove("hidden-menu");

  const leftMenuBtnEl = document.querySelector(".left-menu-btn");
  

  //Toggle the menu button
  leftMenuBtnEl.addEventListener("click", function () {
    leftMenuEl.classList.add("hidden-menu");
  });

  //*Profile page listener
  const profileEl = document.querySelector(".profile");

  //*Wallet page listener
  //*Logout listener
});
