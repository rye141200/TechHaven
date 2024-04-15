"use strict"
//TODO

const chargeBtn = document.getElementById("charge");
const valueBox = document.getElementById("cash-input");
const cash = document.getElementById("cash");

valueBox.value = 0;


document.addEventListener("DOMContentLoaded", function () {
    chargeBtn.addEventListener("click", function charge() {
        const value = valueBox.value;
        // TODO: Check if valid transaction
        if (value == 0) return;

        if (value > 20000) {
            invalidCharge();
        } 
        // TODO: Check if valid transaction
        else {
            const currentValue = parseFloat(cash.textContent);
            const newValue = currentValue + parseFloat(value);
            cash.textContent = newValue;
            validCharge();
        }
    })
});

const invalidCharge = function () {
    const html = `
    <div class = "invalid-charge" id="invalid">
        <h3>Not enough amount to charge</h3>
    </div>
    `;

    const msg = document.getElementById("trans-box");
    if (msg) {
        const child = msg.querySelector("#valid");
        if (child) {
            msg.removeChild(child);
        }
    }

    const transaction = document.getElementById("invalid");
    if (!transaction)
        valueBox.insertAdjacentHTML("beforebegin", html);
}


const validCharge = function () {
    const html = `
    <div class = "valid-charge" id="valid">
        <h3>Successful Transaction</h3>
    </div>
    `;

    const msg = document.getElementById("trans-box");
    if (msg) {
        const child = msg.querySelector("#invalid");
        if (child) {
            msg.removeChild(child);
        }
    }


    const transaction = document.getElementById("valid");
    if (!transaction)
        valueBox.insertAdjacentHTML("beforebegin", html);
}


valueBox.addEventListener("focus", function () {
    valueBox.classList.add("highlight");
});

valueBox.addEventListener("blur", function () {
    valueBox.classList.remove("highlight");
})
