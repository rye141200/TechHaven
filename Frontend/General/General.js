"use strict";
const menuEl = document.querySelector(".menu-nav");
//*Menu button
menuEl.addEventListener("click", function () {
  const leftMenuEl = document.querySelectorAll(".left-menu");
  leftMenuEl.forEach((leftMenu) => leftMenu.classList.remove("hidden-menu"));
  const leftMenuBtnEl = document.querySelectorAll(".left-menu-btn");

  //*Toggle the menu button
  leftMenuBtnEl.forEach((leftMenuBtn) =>
    leftMenuBtn.addEventListener("click", function () {
      leftMenuEl.forEach((leftMenu) => leftMenu.classList.add("hidden-menu"));
    })
  );

  //*Profile page listener
  const profileEl = document.querySelector(".profile");

  //*Wallet page listener
  //*Logout listener
  const logoutBtnEl = document.querySelector(".logout-icon");
  logoutBtnEl.addEventListener("click", function () {
    window.location.href = `/Frontend/Login/login.html`;
  });
});
