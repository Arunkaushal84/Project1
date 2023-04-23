const containerA = document.querySelector('#containerA');
const buttonA = document.querySelector('#toggleButtonA');
const containerB = document.querySelector('#containerB');
const buttonB = document.querySelector('#toggleButtonB');
const containerC = document.querySelector('#containerC');
const buttonC = document.querySelector('#toggleButtonC');
const apiKeyForm = document.getElementById("apiKeyForm");
const googleApiKey = document.getElementById("googleAPIKeyInput");
const dictionaryApiKey = document.getElementById("dictionaryApiKeyInput");

const coverHeading = document.getElementById("cover-heading");
const lead = document.getElementById("lead");
const ogHeading = coverHeading.innerHTML;
const ogLead = lead.innerHTML;

buttonA.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    document.getElementById("cover-heading").innerHTML = "Dictionary & <u><b>Translator</u></b>";
    document.getElementById("lead").innerHTML = `<b><u>First time users should choose the Config button to save your own API key to utilize the website.</u></b>`;
    containerA.classList.toggle('d-none');
    const isHiddenA = containerA.classList.contains('d-none');
    if (!isHiddenA) {
        containerB.classList.add('d-none');
        containerC.classList.add('d-none');
    }
    else {
        coverHeading.innerHTML = ogHeading;
        lead.innerHTML = ogLead;
    }
});

buttonB.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    document.getElementById("cover-heading").innerHTML = "<u><b>Dictionary</u></b> & Translator";
    document.getElementById("lead").innerHTML = `<b><u>First time users should choose the Config button to save your own API key to utilize the website.</u></b>`;
    containerB.classList.toggle('d-none');
    const isHiddenB = containerB.classList.contains('d-none');
    if (!isHiddenB) {
        containerA.classList.add('d-none');
        containerC.classList.add('d-none');
    }
    else {
        coverHeading.innerHTML = ogHeading;
        lead.innerHTML = ogLead;
    }
});

buttonC.addEventListener('click', () => {
    document.getElementById("output-define").innerHTML = "";
    document.getElementById("input-define").value = "";
    document.getElementById("cover-heading").innerHTML = "<u><b>Config</u></b>";
    document.getElementById("lead").innerHTML = `<b><u>It's highly recommended that you input & save both API keys to utilize the entire website's features.</u></b>`;
    containerC.classList.toggle('d-none');
    const isHiddenC = containerC.classList.contains('d-none');
    if (!isHiddenC) {
        containerA.classList.add('d-none');
        containerB.classList.add('d-none');
    }
    else {
        coverHeading.innerHTML = ogHeading;
        lead.innerHTML = ogLead;
    }
});

// Save API key to local storage when the form is submitted
apiKeyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (googleApiKey.value !== "" && dictionaryApiKey.value !== "") {
        localStorage.setItem("googleApiKey", googleApiKey.value);
        localStorage.setItem("dictionaryApiKey", dictionaryApiKey.value);
        document.getElementById("apisaved").innerHTML = "Both API keys saved, reloading page in 2 seconds...";
        setTimeout(function() {
            location.reload();
        }, 2000);
    }    
    if (googleApiKey.value !== "" && dictionaryApiKey.value == "") {
        localStorage.setItem("googleApiKey", googleApiKey.value);
        document.getElementById("apisaved").innerHTML = "Google API key saved, reloading page in 2 seconds...";
        setTimeout(function() {
            location.reload();
        }, 2000);
    } 
    if (googleApiKey.value == "" && dictionaryApiKey.value !== "") {
        localStorage.setItem("dictionaryApiKey", dictionaryApiKey.value);
        document.getElementById("apisaved").innerHTML = "Dictionary API key saved, reloading page in 2 seconds...";
        setTimeout(function() {
            location.reload();
        }, 2000);
    } 
    if (googleApiKey.value == "" && dictionaryApiKey.value == "") {
        document.getElementById("apideleted").innerHTML = "Both API key forms are empty, please enter a valid API key.";
    } 
    
});

// clear API key from local storage when the form is submitted
clearAPIKey.addEventListener("click", (event) => {
    event.preventDefault();
    if (localStorage.getItem("googleApiKey") !== null || localStorage.getItem("dictionaryApiKey") !== null) {
        console.log(localStorage.getItem("googleApiKey") && localStorage.getItem("dictionaryApiKey")) 
        localStorage.clear();
        document.getElementById("apideleted").innerHTML = "API keys deleted, reloading page in 2 seconds...";
        setTimeout(function() {
            location.reload();
        }, 2000);
    }
    else {
        document.getElementById("apideleted").innerHTML = "Both API keys are empty, nothing to delete.";
    }
});