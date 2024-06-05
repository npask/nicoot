function translate(){
    setTimeout(function(){
        var alleTextelemente = document.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p');
        var inputsEles = document.querySelectorAll('input');

        alleTextelemente.forEach(function(element) {
            if(mydata.lang == "German"){translatorToGerman(element)}
        });

        inputsEles.forEach(function(element) {
            if(mydata.lang == "German"){translatorToGermanInput(element)}
        });
    },1)
}

function translatorToGerman(element){
    var text = element.textContent;
    var words = text.split(/\b/); // Splitte an Wortgrenzen

    for (var i = 0; i < words.length; i++) {
        var word = words[i].toLowerCase().replace(/[^\w\s]/g, '');
        if (GermanTranslate[word]) {
            words[i] = GermanTranslate[word];
        }
    }

    element.textContent = words.join("");
}

function translatorToGermanInput(element){
    var text = element.placeholder;
    var words = text.split(/\b/); // Splitte an Wortgrenzen

    for (var i = 0; i < words.length; i++) {
        var word = words[i].toLowerCase().replace(/[^\w\s]/g, '');
        if (GermanTranslate[word]) {
            words[i] = GermanTranslate[word];
        }
    }

    element.placeholder = words.join("");
}