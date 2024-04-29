"use strict";
const redirector = (endpoint) => {
  return fetch(`http://localhost:3000${endpoint}`, {
    method: "GET",
    headers: { "Content-type": "text/html" },
  });
};
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
  //*Home page listener
  const homeEl = document.querySelector(".home");
  homeEl.addEventListener("click", function () {
    redirector("/market").then(() => {
      window.location.href = "/market";
    });
  });
  //*Profile page listener
  const profileEl = document.querySelector(".profile");
  profileEl.addEventListener("click", function () {
    redirector("/profile").then(() => {
      window.location.href = "/profile";
    });
  });
  //*Wallet page listener
  //*Logout listener
  const walletBtnEl = document.querySelector(".wallet");
  walletBtnEl.addEventListener("click", function () {
    redirector("/deposit").then(() => {
      window.location.href = "/deposit";
    });
  });

  //*Logout listener
  const logoutBtnEl = document.querySelector(".logout-icon");
  logoutBtnEl.addEventListener("click", () => {
    redirector("/logout").then(() => {
      window.location.href = "/";
    });
  });
});
