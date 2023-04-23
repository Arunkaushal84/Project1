// Ready function to prevent anything from running unless it is ready and loaded.
$(document).ready(function () {
    // Function to fetch API data then display the definitions of a user inputted word from searchDefinition().
    function defineWord(word){
        // Get the API key from local storage.
        var apiKey = localStorage.getItem('dictionaryApiKey'); //"ac4a6086-68c9-4b49-a9cc-ad60fc350977";
        queryURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;
        // Fetch the data from the API.
        fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
            document.getElementById("output-define").innerHTML = "";
            // Check if the API key is valid.
            var definitionLabels = {};
                // Loop through the data to get the definitions and labels.
                for (var i = 0; i < data.length; i++) {
                    const wordDefine = data[i].shortdef ? data[i].shortdef.join("; ") : "";
                    const wordLabel = data[i].fl ? data[i].fl.charAt(0).toUpperCase() + data[i].fl.slice(1) : "";
                    // Check if the definition is empty.
                    if (wordDefine.trim() !== ""){
                        // Check if the label is already in the object.
                        if(wordLabel in definitionLabels){
                            definitionLabels[wordLabel].push(wordDefine);
                        }
                        // If the label is not in the object, add it.
                        else {
                            definitionLabels[wordLabel] = [wordDefine];
                        }
                    }
                }
                // Loop through the object to display the definitions.
                for (var unitDefine in definitionLabels) {
                    var divEl = document.createElement("div");
                    divEl.className = "definition fade-in";
                    // Create the heading for the label.
                    var heading = document.createElement("h3");
                    heading.textContent = unitDefine;
                    // Create the list for the definitions.
                    var outListEl = document.createElement("ol");
                // Loop through the definitions to display them.
                for (var i = 0; i < definitionLabels[unitDefine].length; i++) {
                    var inListEl = document.createElement("li");
                    // Capitalize the first letter of the definition.
                    var define = definitionLabels[unitDefine][i];
                    define = define.charAt(0).toUpperCase() + define.slice(1);
                    define += ".";
        
                    inListEl.textContent = define;
                    outListEl.appendChild(inListEl);
                }
                // Append the heading and list to the div.
                divEl.appendChild(heading);
                // Append the list to the div.
                divEl.appendChild(outListEl);
                // Append the div to the output.
                document.getElementById("output-define").appendChild(divEl);
                }
                // Add in the animation delay.
                setTimeout(() => {
                    addAnimationDelays();
                }, 100);
            })
            // If the API key is invalid, display an error message.
            .catch(() => {
                console.error("Error:", "API key invalid.");
                document.getElementById("warning-text-define").innerHTML = "Invalid or empty API key!";
            });
    }

    // Function to add in delay in the definition box animation.
    function addAnimationDelays() {
        var definitions = document.getElementsByClassName("definition fade-in");
        for (var i = 0; i < definitions.length; i++) {
          definitions[i].style.animationDelay = (i * 0.4) + "s";
        }
    }

    // Keydown function for when the user uses the "Enter" button.
    $("#input-define").on("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchDefinition();
        }
    });

    // Click function for when the user clicks the "Define" button.
    $("#defineBtn").click(function (event) {
        event.preventDefault();
        searchDefinition();
    });
    
    // function to check user inputted word is valid or not then pass it to defineWord() function.
    function searchDefinition() {
        var word = $("#input-define").val().trim();
        // Check if the word is empty.
        if (word === "") {
            document.getElementById("warning-text-define").innerHTML = "Please enter a word...";
            document.getElementById("output-define").innerHTML = "";
            return;
        }
        // Check if the word is valid.
        var apiKey = localStorage.getItem('dictionaryApiKey'); 
        queryURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;
        // Fetch the data from the API.
        fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
                // Check if the word is valid.
                if (data.length === 0 || !data[0].meta) {
                    document.getElementById("warning-text-define").innerHTML = "Word not found! Please enter a valid word for definition.";
                    document.getElementById("output-define").innerHTML = "";
                    return;
                }
                // If the word is valid, display the definition.
                else {
                    document.getElementById("warning-text-define").innerHTML = "";
                    saveHistoryWord(word);
                    defineWord(word);
                    displayHistoryWord();
                }
            })
            // If the API key is invalid, display an error message.
        .catch(() => {
            console.error("Error:", "API key invalid.");
            document.getElementById("warning-text-define").innerHTML = "Invalid or empty API key!";
        });
    }
    // Function to save the word to the search history. 
    function saveHistoryWord(word) {
        // Search history array
        var searchedWordArray = JSON.parse(localStorage.getItem("definitionHistory")) || [];
        
        searchedWordArray.unshift(word);
        // Check if the array is greater than 5, if yes then remove the last element.
        if (searchedWordArray.length > 4) {
            searchedWordArray.pop();
        }

        localStorage.setItem("definitionHistory", JSON.stringify(searchedWordArray));
    }

    displayHistoryWord();
    // Function to take the variable word value from searchDefinition() 
    function displayHistoryWord() {
        var displayHistoryArray = JSON.parse(localStorage.getItem("definitionHistory")) || [];

        var defineSearchHistoryEl = document.getElementById("dSearchHistory");

        defineSearchHistoryEl.innerHTML = "";
        // Loop through the array to display the search history.
        for (var i = 0; i < displayHistoryArray.length; i++) {
            var searchWord = displayHistoryArray[i];
            var btn = document.createElement("button");
            btn.innerHTML = searchWord;
            btn.classList.add("btn", "btn-secondary", "mx-1")
            btn.addEventListener("click", function() {
                defineWord(this.innerHTML);
            });
            defineSearchHistoryEl.appendChild(btn);
        }
    }
    // Click function for when the user clicks the "Clear History" button.
    $("#clearDefineHistory").click(function (event) {
        event.preventDefault();
        clearHistory();
    });
    // Function to clear the search history.
    function clearHistory() {
        localStorage.removeItem("definitionHistory");
        displayHistoryWord();
    }
})