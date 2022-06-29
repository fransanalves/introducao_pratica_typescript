let updateNumber = document.getElementById('update-number');
let cleanNumber = document.getElementById('clean-number');
let addNumber = document.getElementById('add-number') as HTMLInputElement;
let displayNumber = document.getElementById('display-number') as HTMLElement;

let result = 0;

const sumNumbers = (number: number) => {
    result += number;
    displayNumber.innerHTML = result.toString();
    cleanInputs();
}

const cleanNumbers = () => {
    result = 0;
    displayNumber.innerHTML = result.toString();
}

const cleanInputs = () => addNumber.value = '';

updateNumber?.addEventListener('click', () => {
    sumNumbers(Number(addNumber.value));
});

cleanNumber?.addEventListener('click', cleanNumbers);