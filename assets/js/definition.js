// Ready function to prevent anything from running unless it is ready and loaded.
$(document).ready(function () {

    /* 
        We need a function to take the variable word value from searchDefinition() and put it into local storage then output a search history.
        Once the search history button is outputted, it should store that word into that button then when clicked it will run the defineWord() function to output the definition again.
    */ 

    // Function to fetch API data then display the definitions of a user inputted word from searchDefinition().
    function defineWord(word){

        var apiKey = localStorage.getItem('dictionaryApiKey'); //"ac4a6086-68c9-4b49-a9cc-ad60fc350977";
        queryURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;

        fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
            document.getElementById("output-define").innerHTML = "";
            var definitionLabels = {};
            
                for (var i = 0; i < data.length; i++) {
                    const wordDefine = data[i].shortdef ? data[i].shortdef.join("; ") : "";
                    const wordLabel = data[i].fl ? data[i].fl.charAt(0).toUpperCase() + data[i].fl.slice(1) : "";
                    if (wordDefine.trim() !== ""){
                        if(wordLabel in definitionLabels){
                            definitionLabels[wordLabel].push(wordDefine);
                        }
                        else {
                            definitionLabels[wordLabel] = [wordDefine];
                        }
                    }
                }

                for (var unitDefine in definitionLabels) {
                    var divEl = document.createElement("div");
                    divEl.className = "definition fade-in";
                    
                    var heading = document.createElement("h3");
                    heading.textContent = unitDefine;
                    
                    var outListEl = document.createElement("ol");
    
                for (var i = 0; i < definitionLabels[unitDefine].length; i++) {
                    var inListEl = document.createElement("li");
        
                    var define = definitionLabels[unitDefine][i];
                    define = define.charAt(0).toUpperCase() + define.slice(1);
                    define += ".";
        
                    inListEl.textContent = define;
        
                    outListEl.appendChild(inListEl);
                }
                divEl.appendChild(heading);
                divEl.appendChild(outListEl);
                    
                document.getElementById("output-define").appendChild(divEl);
                }
                setTimeout(() => {
                    addAnimationDelays();
                }, 100);
            })
            .catch(() => {
                console.error("Error:", "API key invalid.");
                document.getElementById("warning-text").innerHTML = "Invalid or empty API key!";
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

        if (word === "") {
            document.getElementById("warning-text").innerHTML = "Please enter a word...";
            document.getElementById("output-define").innerHTML = "";
            return;
        }

        var apiKey = localStorage.getItem('dictionaryApiKey'); //"ac4a6086-68c9-4b49-a9cc-ad60fc350977";
        queryURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=" + apiKey;

        fetch(queryURL)
            .then((response) => response.json())
            .then((data) => {
                if (data.length === 0 || !data[0].meta) {
                    document.getElementById("warning-text").innerHTML = "Word not found! Please enter a valid word for definition.";
                    document.getElementById("output-define").innerHTML = "";
                    return;
                }
                else {
                    document.getElementById("warning-text").innerHTML = "";
                    defineWord(word);
                }
            })
        .catch(() => {
            console.error("Error:", "API key invalid.");
            document.getElementById("warning-text").innerHTML = "Invalid or empty API key!";
        });
    }
})