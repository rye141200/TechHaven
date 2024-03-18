/** Element selection */
const loginTabEl = document.querySelector(".login-tab");
const signupTabEl = document.querySelector(".signup-tab");
const boxEl = document.querySelector(".box");

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
          <button class="btn btn-login">Sign up</button>
        </div>
      </div>
      `;

  loginBoxEl.removeChild(document.querySelector("#login-btn"));
  loginBoxEl.insertAdjacentHTML("afterbegin", html);
  loginBoxEl.insertAdjacentHTML("beforeend", htmlConfirmPassword);
};
const toggleActiveTab = function (e) {
  e.target.classList.add("active-tab");
  e.target.classList.remove("inactive-tab");
  const closest = [...e.target.closest(".box").querySelectorAll(".tab")];
  closest.forEach((tab) => {
    if (tab != e.target) {
      tab.classList.add("inactive-tab");
      tab.classList.remove("active-tab");
    }
  });
};
//Tabbed element listener
boxEl.addEventListener("click", function (e) {
  e.preventDefault();
  const loginBoxEl = document.querySelector(".login-box");
  const flag = e.target.parentElement.querySelector(".firstname");

  //!Guard clause
  if (
    (e.target.classList.contains("signup-tab") && flag) ||
    (e.target.classList.contains("login-tab") && !flag)
  )
    return;

  //*Event delegation
  if (e.target.classList.contains("tab")) {
    toggleActiveTab(e);
    
    //*toggle login or signup form
    if (e.target.classList.contains("signup-tab") && !flag) {
      displaySignupUI(loginBoxEl);
    } else {
      if (flag) {
        displayLoginUI(loginBoxEl);
      }
    }
  }
});
