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

    const flag = e.target.parentElement.querySelector(".firstname");
    //TODO
    if (e.target.classList.contains("signup-tab") && !flag) {
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
      <label class="input-field-label confirmpwd addedPWD" for="fname">Confirm password:</label>
      <input
        class="input-field-element addedPWD"
        type="password"
        id="confirm-input"
        name="fname"
        placeholder="Confirm password"
      />
      `;
      const loginBoxEl = document.querySelector(".login-box");
      loginBoxEl.insertAdjacentHTML("afterbegin", html);
      document
        .querySelector("#password")
        .insertAdjacentHTML("beforeend", htmlConfirmPassword);
    } else {
      if (flag) {
        const elementsToRemove = document.querySelectorAll(".added");
        const elementsToRemovePwd = document.querySelectorAll(".addedPWD");
        const boxEL = document.querySelector(".box");
        const passwordEl = document.querySelector("#password");

        elementsToRemove.forEach((element) => boxEl.removeChild(element));
        elementsToRemovePwd.forEach((element) =>
          passwordEl.removeChild(element)
        );
      }
    }
  }
});
