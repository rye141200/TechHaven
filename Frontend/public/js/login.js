"use strict";
//!if user not logged in (or session expired) clear local storage

//!Element selection
const loginTabEl = document.querySelector(".login-tab");
const signupTabEl = document.querySelector(".signup-tab");
const boxEl = document.querySelector(".box");
const loginBoxEl = document.querySelector(".login-box");
let signupBtnEl;
let loginBtnEl = document.querySelector(".btn-login");
//!Methods
const clearLocalStorage = () => {
  const userCart = JSON.parse(localStorage.getItem("userCart"));
  if (userCart) {
    localStorage.clear();
  }
};
window.addEventListener("DOMContentLoaded", clearLocalStorage);
const displayLoginUI = function (loginBoxEl) {
  const elementsToRemove = document.querySelectorAll(".added");
  elementsToRemove.forEach((element) => loginBoxEl.removeChild(element));
  loginBoxEl.insertAdjacentHTML(
    "beforeend",
    `
    <div class="input-field" id="login-btn">
          <button class="btn btn-login">Login</button>
          </div>
          `
  );
};

const displaySignupUI = function (loginBoxEl) {
  const html = `
      <div class="input-field firstname added">
      <label class="input-field-label" for="fname">First name:</label>
      <input
        class="input-field-element"
        type="email"
        id="firstname-input"
        name="fname"
        placeholder="John"
      />
    </div>
    <div class="input-field added">
    <label class="input-field-label" for="fname">Last name:</label>
      <input
        class="input-field-element"
        type="text"
        id="lastname-input"
        name="fname"
        placeholder="Smith"
        />
        </div>
        `;
  const htmlConfirmPassword = `
  <div class="input-field confirmpwd added">
  <label class="input-field-label confirmpwd addedPWD" for="fname">Confirm password:</label>
  <input
  class="input-field-element"
  type="password"
  id="confirm-input"
  name="fname"
  placeholder="Confirm password"
  />
  </div>
  <div class="input-field added">
  <div class="input-field" id="signup-btn">
  <button class="btn btn-signup">Sign up</button>
  </div>
  </div>
  `;

  loginBoxEl.removeChild(document.querySelector("#login-btn"));
  loginBoxEl.insertAdjacentHTML("afterbegin", html);
  loginBoxEl.insertAdjacentHTML("beforeend", htmlConfirmPassword);
};

const toggleActive = function (tabToBeActive) {
  if (tabToBeActive === "Login") {
    loginTabEl.classList.add("active-tab");
    loginTabEl.classList.remove("inactive-tab");

    signupTabEl.classList.add("inactive-tab");
    signupTabEl.classList.remove("active-tab");
  } else {
    signupTabEl.classList.add("active-tab");
    signupTabEl.classList.remove("inactive-tab");

    loginTabEl.classList.add("inactive-tab");
    loginTabEl.classList.remove("active-tab");
  }
};

const toggleLoginUI = () => {
  displayLoginUI(loginBoxEl);
  toggleActive("Login");
  loginBtnEl = document.querySelector(".btn-login");
  loginBtnEventListener();
  clearInputs();
};
const asyncFetcher = (endpoint, data) => {
  return fetch(`${endpoint}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
    mode: "cors",
    credentials: "include",
  });
};

const signup = (signupData) => {
  asyncFetcher("signup", signupData).then((response) => {
    if (response.status == 201) {
      toggleLoginUI();
    } else {
      alert("User already exists!");
    }
  });
};

const login = async (loginData) => {
  try {
    const databaseQuery = await asyncFetcher("/", loginData);
    localStorage.setItem(
      "userCart",
      JSON.stringify({
        ArrayOfItems: [],
      })
    );
    window.location.href = "/market";
  } catch (err) {
    alert("Couldn't find user");
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
    // window.location.href = `/Frontend/MarketHome/market.html`;
    const loginData = {
      email: document.querySelector("#email-input").value,
      password: document.querySelector("#password-input").value,
    };
    if (loginData.email == "" || loginData.password == "") {
      //!Guard clause
      clearInputs();
      return alert("Please enter valid credentials");
    }
    //TODO => ROUTE TO THE MARKET API ENDPOINT
    const response = await login(loginData);
  });
};
const signupBtnEventListener = function () {
  signupBtnEl.addEventListener("click", () => {
    //TODO
    const signupData = {
      firstName: document.querySelector("#firstname-input").value,
      lastName: document.querySelector("#lastname-input").value,
      email: document.querySelector("#email-input").value,
      password: document.querySelector("#password-input").value,
      confirmPwd: document.querySelector("#confirm-input").value,
    };
    if (
      signupData.confirmPwd != signupData.password ||
      Object.values(signupData).some((inputField) =>
        inputField == "" ? true : false
      )
    ) {
      //!Guard clause
      clearInputs();
      return alert("Please enter valid credentials");
    }
    signup(signupData);
  });
};
boxEl.addEventListener("click", function (e) {
  e.preventDefault();

  const flag = e.target.parentElement.querySelector(".firstname");

  //!Guard clause
  if (
    (e.target.classList.contains("signup-tab") && flag) ||
    (e.target.classList.contains("login-tab") && !flag)
  )
    return;

  //*Event delegation
  if (e.target.classList.contains("tab")) {
    const currentEl = e.target;
    toggleActive(currentEl.innerHTML);

    //*toggle login or signup form
    if (e.target.classList.contains("signup-tab") && !flag) {
      displaySignupUI(loginBoxEl);
      signupBtnEl = document.querySelector(".btn-signup");
      //!Display login when account created successfuly
      signupBtnEventListener();
    } else {
      if (flag) {
        displayLoginUI(loginBoxEl);
        loginBtnEl = document.querySelector(".btn-login");
        loginBtnEventListener();
        signupBtnEl = null;
      }
    }
    clearInputs();
  }
});

loginBtnEventListener();
window.addEventListener("load", function () {
  //TODO
  //Resets the login session
});
