let currentValue = "0";
let previousValue = "";
let operator = null;
let resetScreen = false;

let calculationHistory =
    JSON.parse(localStorage.getItem("pulseHistory")) || [];

const screen = document.getElementById("screen");
const history = document.getElementById("history");

function updateDisplay() {
    screen.textContent = currentValue;
}

function appendNumber(number) {
    if (currentValue === "Error") {
        clearDisplay();
    }

    if (resetScreen) {
        currentValue = "0";
        resetScreen = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (currentValue === "Error") return;

    if (operator !== null && !resetScreen) {
        calculate();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    resetScreen = true;

    history.textContent =
        previousValue + " " + getOperatorSymbol(operator);
}

function calculate() {
    if (operator === null || previousValue === "") {
        return;
    }

    const first = parseFloat(previousValue);
    const second = parseFloat(currentValue);

    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":
            if (second === 0) {
                currentValue = "Error";
                history.textContent = "Cannot divide by zero";
                previousValue = "";
                operator = null;
                resetScreen = true;
                updateDisplay();
                return;
            }

            result = first / second;
            break;
    }

    result = Number(result.toFixed(10));

    const expression =
        previousValue + " " +
        getOperatorSymbol(operator) + " " +
        currentValue + " = " +
        result;

    history.textContent = expression;

    calculationHistory.unshift(expression);

    if (calculationHistory.length > 20) {
        calculationHistory.pop();
    }

    localStorage.setItem(
        "pulseHistory",
        JSON.stringify(calculationHistory)
    );

    currentValue = String(result);
    previousValue = "";
    operator = null;
    resetScreen = true;

    updateDisplay();
}

function clearDisplay() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    resetScreen = false;

    history.textContent = "";

    updateDisplay();
}

function deleteLast() {
    if (currentValue === "Error") {
        clearDisplay();
        return;
    }

    if (resetScreen) {
        return;
    }

    if (currentValue.length <= 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

function percentage() {
    if (currentValue === "Error") return;

    currentValue = String(parseFloat(currentValue) / 100);

    updateDisplay();
}

function getOperatorSymbol(op) {
    if (op === "+") return "+";
    if (op === "-") return "−";
    if (op === "*") return "×";
    if (op === "/") return "÷";

    return "";
}

function showHistory() {
    if (calculationHistory.length === 0) {
        alert("No calculations yet.");
        return;
    }

    alert(
        "PULSE CALCULATOR HISTORY\n\n" +
        calculationHistory.join("\n")
    );
}

updateDisplay();
