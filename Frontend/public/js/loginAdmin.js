"use strict";
//!Element selection
const loginBoxEl = document.querySelector(".login-box");
let loginBtnEl = document.querySelector(".btn-login");
//!Methods
const asyncFetcher = (endpoint, data) => {
  return fetch(`${endpoint}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  });
};

const login = async (loginData) => {
  try {
    const response = await asyncFetcher("/admin/login", loginData);
    const data = await response.json();

    if (data.status === "failure") {
      clearInputs();
      alert(data.message);
    }

    if (data.status === "success") {
      window.location.href = "/admin/dashboard";
    }
  } catch (err) {
    console.log(err);
  }
};

const clearInputs = () => {
  document.querySelectorAll(".input-field-element").forEach((el) => {
    el.value = "";
  });
};

//!Listeners
const loginBtnEventListener = function () {
  loginBtnEl.addEventListener("click", async (e) => {
    e.preventDefault();
    const loginData = {
      email: document.querySelector("#email-input").value,
      password: document.querySelector("#password-input").value,
    };
    if (loginData.email == "" || loginData.password == "") {
      //!Guard clause
      clearInputs();
      return alert("Please enter valid credentials🧑🏿‍🦲");
    }
    //TODO => ROUTE TO THE MARKET API ENDPOINT
    const response = await login(loginData);
    /*
    if (response.status === "success") {
      //REPLACE WITH MARKET FETCH REQUEST
    }*/
  });
};

loginBtnEventListener();
