// set initial count
let count = 0;

// select value and buttons
const value = document.querySelector('#value');
const btns = document.querySelectorAll('.btn');



function colorTester() {
    if (count >= 0) {
        value.style.color = "green";
    } else {
        value.style.color = "red";
    }
}

function increase() {
    count++;
    colorTester();
    value.innerHTML = count;
}

function decrease() {
    count--;
    colorTester();

    value.innerHTML = count;
}

function reset() {
    count = 0;
    value.style.color = "black";
    value.innerHTML = count;
}