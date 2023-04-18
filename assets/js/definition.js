$(document).ready(function () {


    function defineWord(word){
        var apiKey = "ac4a6086-68c9-4b49-a9cc-ad60fc350977";
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
                    divEl.className = "definition";
                    
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
                
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    $("#input-define").on("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchDefinition();
        }
    });

    $("#defineBtn").click(function (event) {
        event.preventDefault();
        searchDefinition();
    });

    function searchDefinition() {
        var word = $("#input-define").val().trim();

        if (word === "") {
            document.getElementById("warning-text").innerHTML = "Please enter a word...";
            document.getElementById("output-define").innerHTML = "";
            return;
        }

        var apiKey = "ac4a6086-68c9-4b49-a9cc-ad60fc350977";
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
        .catch((error) => {
            console.error("Error:", error);
        });
    }
})