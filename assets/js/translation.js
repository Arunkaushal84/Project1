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
      document.getElementById("warning-text").innerHTML = "Invalid or empty API key!";
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
  // if target is not set then give a warning if empty
  if (target === '') {
     document.getElementById('translatewarning').innerHTML = 'Invalid input! Please make sure your API key is set and that you have inputted text to translate.';
     return;
  }
  else {
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
      document.getElementById("warning-text").innerHTML = "Invalid or empty API key!";
    });
}});

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

// Retrieve search history from local storage or create an empty array
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
// Translate button functionality
document.getElementById('translate').addEventListener('click', () => {
  let source = inputTxt.value;
  let target = translateTargetSelect.value;
  if (target === '') {
    console.log('Invalid input. Please make sure your API key is set and that you have input text to translate.');
    return;
 }
 else {
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
      outputText.value = translation;
      // Create a search object and add it to the search history
      const search = {
        source: source,
        target: target,
        translation: translation,
        timestamp: new Date().toISOString()
      };
      searchHistory.push(search);
      // Save the updated search history to local storage
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      // Display search history
      displaySearchHistory();
    })
    .catch(err => {
      console.log(err);
      document.getElementById("warning-text").innerHTML = "Invalid or empty API key!";
    });
}});
// Display search history
function displaySearchHistory() {
  let searchHistoryDiv = document.getElementById('searchHistory');
  searchHistoryDiv.innerHTML = '';
  // Sort search history by timestamp, with most recent searches first
  searchHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  // Loop through each search in the search history and create a list item
  for (let i = 0; i < searchHistory.length; i++) {
    let search = searchHistory[i];
    let li = document.createElement('li');
    li.innerHTML = `${search.source} &#x2192; ${search.translation} (${search.target})`;
    searchHistoryDiv.appendChild(li);
  }
}
displaySearchHistory();

document.getElementById('clearHistory').addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  searchHistory = [];
  displaySearchHistory();
});
