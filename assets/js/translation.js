const apiKey = localStorage.getItem('googleApiKey'); //'AIzaSyBljBSfIn964aICm5vDOVmd76GexCJJlNY';
let synth = speechSynthesis,
    inputForm = document.querySelector('form'),
    inputTxt = document.querySelector('#inputText'),
    outputText = document.querySelector('#outputText'),
    translateTargetSelect = document.querySelector('#translatetarget'),
    speechTargetSelect = document.querySelector('#speechtarget');

const speakCheckBox = document.getElementById('speakCheckBox');
const speechButton = document.getElementById('speech');
const speechDropdown = document.getElementById('speechdropdown');

let voices = [];

function clearOptions(targetSelect) {
  while (targetSelect.firstChild) {
    targetSelect.removeChild(targetSelect.firstChild);
  }
}

function populateTranslationLanguages() {
  fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      let languages = data.data.languages;
      for (let i = 0; i < languages.length; i++) {
        let option = document.createElement('option');
        option.value = languages[i].language;
        option.text = languages[i].language;
        translateTargetSelect.appendChild(option);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

populateTranslationLanguages(); // Call the function to populate translation languages on page load

speakCheckBox.addEventListener('change', () => {
  clearOptions(speechTargetSelect);
  if (speakCheckBox.checked === true) {
    speechDropdown.style.display = 'block';
    speechButton.style.display = 'inline-block';
    function getVoices() {
      voices = synth.getVoices();
      voices.forEach(voice => {
        let option = document.createElement('option');
        option.value = voice.name;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        option.textContent = voice.name + ' (' + voice.lang + ')';
        speechTargetSelect.appendChild(option);
      });
    }
    getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = getVoices;
    }
  } else {
    speechDropdown.style.display = 'none'; // Hide the speech dropdown
    speechButton.style.display = 'none'; // Hide the speech button
  }
});

// Hide the speech button and dropdown on page load
speechButton.style.display = 'none';
speechDropdown.style.display = 'none';

// Rest of the code

// Translate button functionality
document.getElementById('translate').addEventListener('click', () => {
  let source = inputTxt.value;
  let target = translateTargetSelect.value;

  fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify({
      q: source,
      target: target
    })
  })
    .then(response => response.json())
    .then(data => {
      let translation = data.data.translations[0].translatedText;
      document.getElementById('outputText').value = translation;
    })
    .catch(err => {
      console.log(err);
    });
});

// Speak button functionality
document.getElementById('speech').addEventListener('click', () => {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }
  if (outputText.value !== '') {
    let utterThis = new SpeechSynthesisUtterance(outputText.value);
    let selectedOption = speechTargetSelect.selectedOptions[0].getAttribute('data-name');
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    utterThis.rate = 0.8;
    synth.speak(utterThis);
  }
});

