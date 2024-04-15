"use strict"
//TODO

const chargeBtn = document.getElementById("charge");
const valueBox = document.getElementById("cash-input");
const cash = document.getElementById("cash");

valueBox.value = 0;


document.addEventListener("DOMContentLoaded", function () {
    chargeBtn.addEventListener("click", function charge() {
        let value = valueBox.value;
        // TODO: Check if valid transaction
        if (value == 0)
            return;

        if (value > 20000) {
            invalidCharge();
        } else {
            let currentValue = parseFloat(cash.textContent);
            let newValue = currentValue + parseFloat(value);
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

    let msg = document.getElementById("trans-box");
    if (msg) {
        let child = msg.querySelector("#valid");
        if (child) {
            msg.removeChild(child);
        }
    }

    let transaction = document.getElementById("invalid");
    if (!transaction)
        valueBox.insertAdjacentHTML("beforebegin", html);
}


const validCharge = function () {
    const html = `
    <div class = "valid-charge" id="valid">
        <h3>Successful Transaction</h3>
    </div>
    `;

    let msg = document.getElementById("trans-box");
    if (msg) {
        var child = msg.querySelector("#invalid");
        if (child) {
            msg.removeChild(child);
        }
    }


    let transaction = document.getElementById("valid");
    if (!transaction)
        valueBox.insertAdjacentHTML("beforebegin", html);
}



valueBox.addEventListener("focus", function () {
    console.log("Hello");
    valueBox.classList.add("highlight");
});

valueBox.addEventListener("blur", function () {
    valueBox.classList.remove("highlight");
})
