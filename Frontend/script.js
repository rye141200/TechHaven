"use strict";
/** Element selection */
const loginTabEl = document.querySelector(".login-tab");
const signupTabEl = document.querySelector(".signup-tab");
const boxEl = document.querySelector(".box");
const loginBoxEl = document.querySelector(".login-box");
let signupBtnEl;
/* Methods */
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

//!Tabbed element listener
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
      signupBtnEl.addEventListener("click", function () {
        if (true) {
          //If account created sucsessfuly display login
          displayLoginUI(loginBoxEl);
          toggleActive("Login");
        }
      });
    } else {
      if (flag) {
        displayLoginUI(loginBoxEl);
        signupBtnEl = null;
      }
    }
  }
});
