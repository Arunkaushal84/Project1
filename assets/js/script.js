const containerA = document.querySelector('#containerA');
const buttonA = document.querySelector('#toggleButtonA');
const containerB = document.querySelector('#containerB');
const buttonB = document.querySelector('#toggleButtonB');
const containerC = document.querySelector('#containerC');
const buttonC = document.querySelector('#toggleButtonC');
const apiKeyForm = document.getElementById("apiKeyForm");
const googleApiKey = document.getElementById("googleAPIKeyInput");
const dictionaryApiKey = document.getElementById("dictionaryApiKeyInput");

buttonA.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    containerA.classList.toggle('d-none');
    const isHiddenA = containerA.classList.contains('d-none');
    console.log(`Container A is hidden: ${isHiddenA}`);
    if (!isHiddenA) {
        containerB.classList.add('d-none');
        containerC.classList.add('d-none');
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
        containerC.classList.add('d-none');
        console.log(`Container A is hidden: true`);
    }
});

buttonC.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    containerC.classList.toggle('d-none');
    const isHiddenC = containerC.classList.contains('d-none');
    console.log(`Container C is hidden: ${isHiddenC}`);
    if (!isHiddenC) {
        containerA.classList.add('d-none');
        containerB.classList.add('d-none');
        console.log(`Container C is hidden: true`);
    }
});
        // Save API key to local storage when the form is submitted
apiKeyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("googleApiKey", googleApiKey.value);
    localStorage.setItem("dictionaryApiKey", dictionaryApiKey.value);
    alert("API key saved!");
});