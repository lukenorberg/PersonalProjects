let screen = document.querySelector(".text-in-screen");
let tempValue = "";
let value = [];
let operator = [];
let lastChar = screen.innerHTML.charAt(screen.innerHTML.length - 1);

const math_it_up = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y },
    '*': function (x, y) { return x * y},
    '/': function (x, y) { return x / y}
};  

// operates on the numbers

function operate() {
    finalValue = 0;
    for (let i=0; i < operator.length; i++) {
        tempValue = math_it_up[operator[i]](value[i], value[i + 1]);
        value[i + 1] = tempValue;
    }
    finalValue = value[value.length - 1];
    // prints an error if conditions are met
    if (finalValue == Infinity) {
        screen.innerHTML = "error";
        screen.style.color = "#52393a";
    } else if (finalValue != Math.floor(finalValue)) {
        screen.innerHTML = parseFloat(finalValue.toFixed(5));
    } else {
        screen.innerHTML = finalValue;
    }

}

// adds value to the screen

function maxLength(add) {
    if (screen.innerHTML.length < 30) {
        screen.innerHTML += add;
        tempValue += add;
    } 
}

function buttonZero() {
    maxLength("0");
}
function buttonOne() {
    maxLength("1");

}
function buttonTwo() {
    maxLength("2");


}
function buttonThree() {
    maxLength("3");

}
function buttonFour() {
    maxLength("4");

}
function buttonFive() {
    maxLength("5");

}
function buttonSix() {
    maxLength("6");
}
function buttonSeven() {
    maxLength("7");

}
function buttonEight() {
    maxLength("8");

}
function buttonNine() {
    maxLength("9");
}

//prevents unneccessary periods

function buttonDot() {
    if (!tempValue.includes(".")) {
        maxLength(".");
    }
}

// add function that checks if other operators are printed
function buttonPlus() {
    if (!["+", "-", "*", "/"].includes(screen.innerHTML.charAt(screen.innerHTML.length - 1)) && screen.innerHTML != "") {
        value.push(Number(tempValue));
        operator.push("+");
        screen.innerHTML += "+";
        tempValue = "";
    }
}

// minus function that checks if other operators are printed
function buttonMinus() {
    if (!["+", "-", "*", "/"].includes(screen.innerHTML.charAt(screen.innerHTML.length - 1)) && screen.innerHTML != "") {
        value.push(Number(tempValue));
        operator.push("-");
        screen.innerHTML += "-";
        tempValue = "";
    }
}

// multiply function that checks if other operators are printed
function buttonMultiply() {
    if (!["+", "-", "*", "/"].includes(screen.innerHTML.charAt(screen.innerHTML.length - 1)) && screen.innerHTML != "") {
        value.push(Number(tempValue));
        operator.push("*");
        screen.innerHTML += "*";
        tempValue = "";
    }
}

// divide function that checks if other operators are printed
function buttonDivide() {
    if (!["+", "-", "*", "/"].includes(screen.innerHTML.charAt(screen.innerHTML.length - 1)) && screen.innerHTML != "") {
        value.push(Number(tempValue));
        operator.push("/");
        screen.innerHTML += "/";
        tempValue = "";
    }
}

// equals function that checks if other operators are printed
function buttonEquals() {
    if (!screen.innerHTML.includes("=") && !["+", "-", "*", "/", ""].includes(screen.innerHTML.charAt(screen.innerHTML.length - 1))) {
        value.push(Number(tempValue));
        tempValue = "";
        operate();
    }
}
function buttonClear() {
    screen.innerHTML = "";
    tempValue = "";
    value = [];
    operator = [];
}