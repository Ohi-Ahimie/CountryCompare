document.getElementById("flipButton").onclick = function() {flipCountries()};
document.getElementById("shareButton").onclick = function() {copyShareLink()};
document.getElementById("country1Search").onclick = function() {getCountry(country1, document.getElementById("country1Field").value)};
document.getElementById("country2Search").onclick = function() {getCountry(country2, document.getElementById("country2Field").value)};
document.getElementById("country1Random").onclick = function() {getRandomCountry(country1)};
document.getElementById("country2Random").onclick = function() {getRandomCountry(country2)};
document.getElementById("country1Field").onkeyup = function(event) {countryFieldOnKey(event, country1)};
document.getElementById("country2Field").onkeyup = function(event) {countryFieldOnKey(event, country2)};

// just meant to stop scrapers and low effort key grabbers for sake of portfolio project
const COUNTRIES_KEY = "cmNfbGl2ZV84NDAxMzFiZDBkOTg0Yjk2OGUwMTM3MDI4NWY4MTk2Yg==";

let country1 = {
    entry: 1,
    data: null,
    isLoading: false,
};

let country2 = {
    entry: 2,
    data: null,
    isLoading: false,
};

const languageHints = {
    "South America": ["spa"],
    "Africa": ["fra", "ara", "mey", "eng"],
    "Asia": ["heb", "ara", "pus", "tuk", "uzb"],
    "Europe": ["nob", "nld", "gsw"]
}

let allCountriesNames = null;

const minSpamThreshold = 800;

function countryFieldOnKey(event, countryRecord){
    if (event.keyCode == 13) {  // enter
        document.activeElement.blur();
        getCountry(countryRecord, document.getElementById(`country${countryRecord.entry}Field`).value);  
    }
}

function getCountry(countryRecord, rawSearchTerm){
    if (!countryRecord.isLoading){
        const searchTerm = handleSearchTerm(rawSearchTerm);
        countryRecord.isLoading = true;

        fetch(
            `https://api.restcountries.com/countries/v5?q=${searchTerm}&limit=100`,
            { headers: { 'Authorization': `Bearer ${window.atob(COUNTRIES_KEY)}` } }
        )
        .then(response => {
            setTimeout(()=>{countryRecord.isLoading = false;}, minSpamThreshold);
            if (response.ok){
                return response.json();
            }
            return null;
        })
        .then(rawData => {
            setCountryRecordFromData(countryRecord, searchTerm, rawData);
        }).catch(err => {
            setTimeout(()=>{countryRecord.isLoading = false;}, minSpamThreshold);
            console.log(err);
        });
    }
    
}

function setCountryRecordFromData(countryRecord, searchTerm, rawData){
    // console.log(rawData);
    const data = rawData.data.objects;
    countryRecord.data = data && chooseCountryFromData(searchTerm, data);
    // console.log(countryRecord);

    setCountryDisplayData(countryRecord);
    handleBothCountriesSet();
}

function setCountryDisplayData(countryRecord){
    const entry = countryRecord.entry;
    if (countryRecord.data){
        document.getElementById(`country${entry}Flag`).src = countryRecord.data["flag"]["url_svg"];
        document.getElementById(`country${entry}Flag`).alt = countryRecord.data["flag"]["description"];
        if (!countryRecord.data["capitals"] || countryRecord.data["capitals"].length === 0){
            document.getElementById(`country${entry}CapitalExists`).hidden = true;
            document.getElementById(`country${entry}NoCapital`).hidden = false;
            document.getElementById(`country${entry}SingleCapital`).hidden = true;
            document.getElementById(`country${entry}MultiCapital`).hidden = true;
        }else{
            document.getElementById(`country${entry}CapitalExists`).hidden = false;
            document.getElementById(`country${entry}NoCapital`).hidden = true;
            if(countryRecord.data["capitals"].length == 1){
                document.getElementById(`country${entry}SingleCapital`).hidden = false;
                document.getElementById(`country${entry}MultiCapital`).hidden = true;
                document.getElementById(`country${entry}Capital`).innerHTML = countryRecord.data["capitals"][0]["name"];
            }else{
                document.getElementById(`country${entry}SingleCapital`).hidden = true;
                document.getElementById(`country${entry}MultiCapital`).hidden = false;
                document.getElementById(`country${entry}Capital`).innerHTML = getMultiCapitalString(countryRecord.data["capitals"]);
            }
        }
        document.getElementById(`country${entry}LocalName`).innerHTML = getLocalName(countryRecord.data);
        document.getElementById(`country${entry}Subregion`).innerHTML = countryRecord.data["subregion"] ? countryRecord.data["subregion"] : countryRecord.data["region"];
        document.getElementById(`country${entry}Size`).innerHTML = addCommas(countryRecord.data["area"]["kilometers"] + "");
        if (!countryRecord.data["currencies"] || countryRecord.data["currencies"].length === 0 || countryRecord.data["currencies"][0]["code"] === "N/A"){
            countryRecord.data["currencies"] = [{"code" : "N/A"}];
            document.getElementById(`country${entry}CurrencyExists`).hidden = true;
            document.getElementById(`country${entry}NoCurrency`).hidden = false;
        }else{
            document.getElementById(`country${entry}CurrencyExists`).hidden = false;
            document.getElementById(`country${entry}NoCurrency`).hidden = true;
            // const curCode = countryRecord.data["currencies"][0]["code"];
            document.getElementById(`country${entry}Currency`).innerHTML = `the ${countryRecord.data["currencies"][0]["name"]} (${countryRecord.data["currencies"][0]["symbol"]} or ${countryRecord.data["currencies"][0]["code"]})`;
        }
        document.getElementById(`country${entry}Population`).innerHTML = addCommas(countryRecord.data["population"] + "");
        document.getElementById(`country${entry}WikiLink`).href = "https://en.wikipedia.org/w/index.php?sort=relevance&search=" + countryRecord.data["names"]["common"];
        document.getElementById(`country${entry}LinkName`).innerHTML = countryRecord.data["names"]["common"];
        document.getElementById(`country${entry}Field`).value = countryRecord.data["names"]["common"];

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
        const size1 = country1.data["area"]["kilometers"];
        const size2 = country2.data["area"]["kilometers"];
        document.getElementById("country1SizeRatio").innerHTML = formatNumbers((size1/size2).toFixed(3)+"");
        document.getElementById("country1Country2Reference").innerHTML = country2.data["names"]["common"];
        document.getElementById("country1Currency2").innerHTML = country1.data["currencies"][0]["code"];
        document.getElementById("country1Demonym").innerHTML = country1.data["demonyms"]["eng"]["m"];
        document.getElementById("country2Currency2").innerHTML = country2.data["currencies"][0]["code"];
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
        getCurrencyConversion(country1.data["currencies"][0]["code"], country2.data["currencies"][0]["code"], flip);
    }
}

function chooseCountryFromData(searchTerm, data){
    if (data.length == 1 || !searchTerm){
        return data[0];
    }

    for(const currentData of data){
        // console.log("CURR DATA");
        // console.log(currentData);
        for (const spelling of currentData["names"]["alternates"]){
            if (searchTerm.localeCompare(spelling, undefined, {sensitivity: 'accent'}) === 0){
                return currentData;
            }
        }
        
        if (searchTerm.localeCompare(currentData["names"]["common"], undefined, {sensitivity: 'accent'}) === 0 || searchTerm.localeCompare(currentData["names"]["official"], undefined, {sensitivity: 'accent'}) === 0){
            return currentData;
        }

        if(currentData["languages"]){
            const languages = currentData["languages"].map((lang)=>{
                return lang["iso639_3"];
            });

            for (const lang of languages){
                if (currentData["names"]["native"][lang] && (searchTerm.localeCompare(currentData["names"]["native"][lang]["common"], undefined, {sensitivity: 'accent'}) === 0 || searchTerm.localeCompare(currentData["names"]["native"][lang]["official"], undefined, {sensitivity: 'accent'}) === 0)){
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
            if (countryData["names"]["native"][lang]){
                return countryData["names"]["native"][lang]["common"];
            }
        }
    }

    if(countryData["languages"]){
        const languages = countryData["languages"].map((lang)=>{
            return lang["iso639_3"];
        });
        languages.sort((a, b)=>{
            if (a !== "eng" && b !== "eng"){
                return 0;
            }else if (a === "eng"){
                return 1;
            }
            return -1;
        });
        
        for (const lang of languages){
            if (countryData["names"]["native"][lang]){
                return countryData["names"]["native"][lang]["common"];
            }  
        } 
    }

    return countryData["names"]["common"];
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
    if(!countryRecord.isLoading){
        const sizeSet = 254;
        const index = parseInt(Math.random() * sizeSet);
        countryRecord.isLoading = true;

        fetch(
            `https://api.restcountries.com/countries/v5?limit=1&offset=${index}`,
            { headers: { 'Authorization': `Bearer ${window.atob(COUNTRIES_KEY)}` } }
        )
        .then(response => {
            setTimeout(()=>{countryRecord.isLoading = false;}, minSpamThreshold);
            if (response.ok){
                return response.json();
            }
            return null;
        })
        .then(rawData => {
            setCountryRecordFromData(countryRecord, null, rawData);
            document.getElementById(`country${countryRecord.entry}Field`).value = countryRecord.data["names"]["common"];
        }).catch(err => {
            setTimeout(()=>{countryRecord.isLoading = false;}, minSpamThreshold);
            console.log(err);
        });
    }
}

function copyShareLink(){
    let url = window.location.href;
    url = url.split("?")[0];
    
    if(country1.data){
        url = url + "?country1=" + encodeURIComponent(country1.data["names"]["common"]);
    }
    if(country2.data){
        if(url.includes("?")){
            url = url + "&country2=" + encodeURIComponent(country2.data["names"]["common"]);
        }else{
            url = url + "?country2=" + encodeURIComponent(country2.data["names"]["common"]);
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
        capitalStr += `${capitalArr[i]["name"]}, `;
    }

    capitalStr += `and ${capitalArr[capitalArr.length-1]["name"]}`;
    return capitalStr;
}

function handleSearchTerm(rawSearchTerm){
    if(rawSearchTerm.localeCompare("Korea", undefined, {sensitivity: 'accent'}) === 0){
        return "South Korea";
    }
    
    if(rawSearchTerm.localeCompare("US", undefined, {sensitivity: 'accent'}) === 0){
        return "United States";
    }

    const ukList = ["Wales", "Welsh", "Scotland", "Scots", "North Ireland", "Northern Ireland", "England", "English"];

    for (term of ukList){
        if(rawSearchTerm.localeCompare(term, undefined, {sensitivity: 'accent'}) === 0){
            return "United Kingdom";
        }
    }

    return rawSearchTerm;
}