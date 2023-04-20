const containerA = document.querySelector('#containerA');
const buttonA = document.querySelector('#toggleButtonA');
const containerB = document.querySelector('#containerB');
const buttonB = document.querySelector('#toggleButtonB');

buttonA.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    containerA.classList.toggle('d-none');
    const isHiddenA = containerA.classList.contains('d-none');
    console.log(`Container A is hidden: ${isHiddenA}`);
    if (!isHiddenA) {
        containerB.classList.add('d-none');
        console.log(`Container B is hidden: true`);
    }
});

buttonB.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    containerB.classList.toggle('d-none');
    const isHiddenB = containerB.classList.contains('d-none');
    console.log(`Container B is hidden: ${isHiddenB}`);
    if (!isHiddenB) {
        containerA.classList.add('d-none');
        console.log(`Container A is hidden: true`);
    }
});
