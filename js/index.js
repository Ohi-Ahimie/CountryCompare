document.getElementById("flipButton").onclick = function() {flipCountries()};
document.getElementById("shareButton").onclick = function() {copyShareLink()};
document.getElementById("country1Search").onclick = function() {getCountry(country1, document.getElementById("country1Field").value)};
document.getElementById("country2Search").onclick = function() {getCountry(country2, document.getElementById("country2Field").value)};
document.getElementById("country1Random").onclick = function() {getRandomCountry(country1)};
document.getElementById("country2Random").onclick = function() {getRandomCountry(country2)};
document.getElementById("country1Field").onkeyup = function(event) {countryFieldOnKey(event, country1)};
document.getElementById("country2Field").onkeyup = function(event) {countryFieldOnKey(event, country2)};

let country1 = {
    entry: 1,
    data: null,
};

let country2 = {
    entry: 2,
    data: null,
};

const languageHints = {
    "South America": ["spa"],
    "Africa": ["fra", "ara", "mey", "eng"],
    "Asia": ["heb", "ara", "pus", "tuk", "uzb"],
    "Europe": ["nob", "nld", "gsw"]
}

let allCountriesNames = null;

function countryFieldOnKey(event, countryRecord){
    if (event.keyCode == 13) {  // enter
        document.activeElement.blur();
        getCountry(countryRecord, document.getElementById(`country${countryRecord.entry}Field`).value);  
    }
}

function getCountry(countryRecord, rawSearchTerm){
    const searchTerm = handleSearchTerm(rawSearchTerm);
    fetch(`https://restcountries.com/v3.1/name/${searchTerm}`)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        return null;
    })
    .then(data => {
        countryRecord.data = data && chooseCountryFromData(searchTerm, data);
        // console.log(countryRecord);

        setCountryDisplayData(countryRecord);
        handleBothCountriesSet();

    }).catch(err => {
        console.log(err);
    });
}

function setCountryDisplayData(countryRecord){
    const entry = countryRecord.entry;
    if (countryRecord.data){
        document.getElementById(`country${entry}Flag`).src = countryRecord.data["flags"]["svg"];
        document.getElementById(`country${entry}Flag`).alt = countryRecord.data["flags"]["alt"];
        if (!countryRecord.data["capital"]){
           document.getElementById(`country${entry}CapitalExists`).hidden = true;
           document.getElementById(`country${entry}NoCapital`).hidden = false;
           document.getElementById(`country${entry}SingleCapital`).hidden = true;
                document.getElementById(`country${entry}MultiCapital`).hidden = true;
        }else{
            document.getElementById(`country${entry}CapitalExists`).hidden = false;
            document.getElementById(`country${entry}NoCapital`).hidden = true;
            if(countryRecord.data["capital"].length == 1){
                document.getElementById(`country${entry}SingleCapital`).hidden = false;
                document.getElementById(`country${entry}MultiCapital`).hidden = true;
                document.getElementById(`country${entry}Capital`).innerHTML = countryRecord.data["capital"][0];
            }else{
                document.getElementById(`country${entry}SingleCapital`).hidden = true;
                document.getElementById(`country${entry}MultiCapital`).hidden = false;
                document.getElementById(`country${entry}Capital`).innerHTML = getMultiCapitalString(countryRecord.data["capital"]);
            }
        }
        document.getElementById(`country${entry}LocalName`).innerHTML = getLocalName(countryRecord.data);
        document.getElementById(`country${entry}Subregion`).innerHTML = countryRecord.data["subregion"] ? countryRecord.data["subregion"] : countryRecord.data["region"];
        document.getElementById(`country${entry}Size`).innerHTML = addCommas(countryRecord.data["area"] + "");
        if (!countryRecord.data["currencies"]){
            countryRecord.data["currencies"] = {"N/A" : null};
            document.getElementById(`country${entry}CurrencyExists`).hidden = true;
            document.getElementById(`country${entry}NoCurrency`).hidden = false;
        }else{
            document.getElementById(`country${entry}CurrencyExists`).hidden = false;
            document.getElementById(`country${entry}NoCurrency`).hidden = true;
            const curCode = Object.keys(countryRecord.data["currencies"])[0];
            document.getElementById(`country${entry}Currency`).innerHTML = `the ${countryRecord.data["currencies"][curCode]["name"]} (${countryRecord.data["currencies"][curCode]["symbol"]} or ${curCode})`;
        }
        document.getElementById(`country${entry}Population`).innerHTML = addCommas(countryRecord.data["population"] + "");
        document.getElementById(`country${entry}WikiLink`).href = "https://en.wikipedia.org/w/index.php?sort=relevance&search=" + countryRecord.data["name"]["common"];
        document.getElementById(`country${entry}LinkName`).innerHTML = countryRecord.data["name"]["common"];
        document.getElementById(`country${entry}Field`).value = countryRecord.data["name"]["common"];

        let group = document.getElementsByClassName(`country${entry}SelectedGroup`);
        for(var i = 0; i < group.length; i++){
            group[i].hidden = false
        }
        
        group = document.getElementsByClassName(`defaultGroup${entry}`);
        for(var i = 0; i < group.length; i++){
            group[i].hidden = true
        }

        group = document.getElementsByClassName(`errorGroup${entry}`);
        for(var i = 0; i < group.length; i++){
            group[i].hidden = true
        }
    } else {
        document.getElementById(`country${entry}Flag`).src = "img/earthQuestionMark.png";
        document.getElementById(`country${entry}Flag`).alt = "An illustration of the earth with a question mark over top of it.";

        let group = document.getElementsByClassName(`defaultGroup${entry}`);
        for(var i = 0; i < group.length; i++){
            group[i].hidden = true
        }
        
        group = document.getElementsByClassName("bothSelectedGroup");
        for(var i = 0; i < group.length; i++){
            group[i].hidden = true
        }
        
        group = document.getElementsByClassName(`errorGroup${entry}`);
        for(var i = 0; i < group.length; i++){
            group[i].hidden = false
        }

        group = document.getElementsByClassName(`country${entry}SelectedGroup`);
        for(var i = 0; i < group.length; i++){
            group[i].hidden = true
        }
    }   
}

function handleBothCountriesSet(flip=false){
    if (country1.data && country2.data){
        document.getElementById("bothSelectedCurrencyBox").hidden = true;
        const size1 = country1.data["area"];
        const size2 = country2.data["area"];
        document.getElementById("country1SizeRatio").innerHTML = formatNumbers((size1/size2).toFixed(3)+"");
        document.getElementById("country1Country2Reference").innerHTML = country2.data["name"]["common"];
        document.getElementById("country1Currency2").innerHTML = Object.keys(country1.data["currencies"])[0];
        document.getElementById("country1Demonym").innerHTML = country1.data["demonyms"]["eng"]["m"];
        document.getElementById("country2Currency2").innerHTML = Object.keys(country2.data["currencies"])[0];
        const pop1 = country1.data["population"];
        const pop2 = country2.data["population"];
        document.getElementById("country2PopulationRatio").innerHTML = formatNumbers((pop2/pop1).toFixed(3)+"");
        document.getElementById("country2Demonym").innerHTML = country2.data["demonyms"]["eng"]["m"];

        const group = document.getElementsByClassName("bothSelectedGroup");
        for(var i = 0; i < group.length; i++){
            if(group[i].id != "bothSelectedCurrencyBox"){
                group[i].hidden = false
            }
        }
        getCurrencyConversion(Object.keys(country1.data["currencies"])[0], Object.keys(country2.data["currencies"])[0], flip);
    }
}

function chooseCountryFromData(searchTerm, data){
    if (data.length == 1){
        return data[0];
    }

    for(const currentData of data){
        // console.log("CURR DATA");
        // console.log(currentData);
        for (const spelling of currentData["altSpellings"]){
            if (searchTerm.localeCompare(spelling, undefined, {sensitivity: 'accent'}) === 0){
                return currentData;
            }
        }
        
        if (searchTerm.localeCompare(currentData["name"]["common"], undefined, {sensitivity: 'accent'}) === 0 || searchTerm.localeCompare(currentData["name"]["official"], undefined, {sensitivity: 'accent'}) === 0){
            return currentData;
        }

        if(currentData["languages"]){
            const languages = Object.keys(currentData["languages"]);
            for (const lang of languages){
                if (currentData["name"]["nativeName"][lang] && (searchTerm.localeCompare(currentData["name"]["nativeName"][lang]["common"], undefined, {sensitivity: 'accent'}) === 0 || searchTerm.localeCompare(currentData["name"]["nativeName"][lang]["official"], undefined, {sensitivity: 'accent'}) === 0)){
                    return currentData;
                }
            }
        }
    }

    return data[0];
}

function getLocalName(countryData){
    const hintsRegions = Object.keys(languageHints);
    if (hintsRegions.includes(countryData["continents"][0])){
        for (const lang of languageHints[countryData["continents"][0]]){
            if (countryData["name"]["nativeName"][lang]){
                return countryData["name"]["nativeName"][lang]["common"];
            }
        }
    }

    if(countryData["languages"]){
        const languages = Object.keys(countryData["languages"]);
        languages.sort((a, b)=>{
            if (a !== "eng" && b !== "eng"){
                return 0;
            }else if (a === "eng"){
                return 1;
            }
            return -1;
        });
        
        for (const lang of languages){
            if (countryData["name"]["nativeName"][lang]){
                return countryData["name"]["nativeName"][lang]["common"];
            }  
        } 
    }

    return countryData["name"]["common"];
}

function flipCountries(){
    const tempData = {...country1.data};
    country1.data = country2.data;
    country2.data = tempData;
    setCountryDisplayData(country1);
    setCountryDisplayData(country2);
    handleBothCountriesSet(true);
}

function getRandomCountry(countryRecord){
    if (!allCountriesNames){
        fetch("https://restcountries.com/v3.1/all?fields=name")
        .then(response => {
            if (response.ok){
                return response.json();
            }
            return null;
        })
        .then(data => {
            allCountriesNames = data;
            const index = parseInt(Math.random() * allCountriesNames.length);
            getCountry(countryRecord, allCountriesNames[index]["name"]["common"]);
            document.getElementById(`country${countryRecord.entry}Field`).value = allCountriesNames[index]["name"]["common"];
        }).catch(err => {
            console.log(err);
        });
    } else {
        const index = parseInt(Math.random() * allCountriesNames.length);
        getCountry(countryRecord, allCountriesNames[index]["name"]["common"]);
        document.getElementById(`country${countryRecord.entry}Field`).value = allCountriesNames[index]["name"]["common"];
    }
}

function copyShareLink(){
    let url = window.location.href;
    url = url.split("?")[0];
    
    if(country1.data){
        url = url + "?country1=" + encodeURIComponent(country1.data["name"]["common"]);
    }
    if(country2.data){
        if(url.includes("?")){
            url = url + "&country2=" + encodeURIComponent(country2.data["name"]["common"]);
        }else{
            url = url + "?country2=" + encodeURIComponent(country2.data["name"]["common"]);
        }
    }

    // console.log(url);
    window.navigator.clipboard.writeText(url);

    // flash link copied text, then fade it out
    const fadeTime = 1000; //ms
    const displayTime = 5000; //ms

    const linkAlertText = document.getElementById("linkAlertText");
    linkAlertText.style.opacity = 1;
    linkAlertText.style.cursor = "text";
    setTimeout(()=>{
        const intervalId = window.setInterval(()=>{
            linkAlertText.style.opacity -= 0.01;
        }, fadeTime/100);

        setTimeout(()=>{
            clearInterval(intervalId);
            linkAlertText.style.opacity = 0;
            linkAlertText.style.cursor = "default";
        }, fadeTime);
    }, displayTime);
}

function getMultiCapitalString(capitalArr){
    let capitalStr = "";
    for(let i = 0; i < capitalArr.length-1; i++){
        capitalStr += `${capitalArr[i]}, `;
    }

    capitalStr += `and ${capitalArr[capitalArr.length-1]}`;
    return capitalStr;
}

function handleSearchTerm(rawSearchTerm){
    if(rawSearchTerm.localeCompare("Korea", undefined, {sensitivity: 'accent'}) === 0){
        return "South Korea";
    }

    const ukList = ["Wales", "Welsh", "Scotland", "Scots", "North Ireland", "Northern Ireland", "England", "English"];

    for (term of ukList){
        if(rawSearchTerm.localeCompare(term, undefined, {sensitivity: 'accent'}) === 0){
            return "United Kingdom";
        }
    }

    return rawSearchTerm;
}