let exchangeRate = null;
let reciprocal = null;

// just meant to stop scrapers and low effort key grabbers for sake of portfolio project
const CURRENCY_KEY = "ZTE3ODA5Y2U3M2Q2NTBlY2I4ZjZjODMw";

function getCurrencyConversion(cur1, cur2, flip=false){
    if (cur1 === "N/A" || cur2 === "N/A"){
        document.getElementById("exchangeRateSuccess").hidden = true;
        document.getElementById("exchangeRateFail").hidden = true;
        document.getElementById("NoExchangeRate").hidden = false;

        document.getElementById("bothSelectedCurrencyBox").hidden = false;
        document.getElementById("currencyConverterLoader").hidden = true;
    }else if(cur1 === cur2){
        exchangeRate = 1;
        reciprocal = 1;
        document.getElementById("country2CurrencyAmount").innerHTML = (exchangeRate).toFixed(3);
        document.getElementById("exchangeRateSuccess").hidden = false;
        document.getElementById("exchangeRateFail").hidden = true;
        document.getElementById("NoExchangeRate").hidden = true;
        document.getElementById("bothSelectedCurrencyBox").hidden = false;
        document.getElementById("currencyConverterLoader").hidden = true;
    }else if (flip){
        if(exchangeRate){
            let temp = reciprocal;
            reciprocal = exchangeRate;
            exchangeRate = temp;
            document.getElementById("country2CurrencyAmount").innerHTML = (exchangeRate).toFixed(3);
            document.getElementById("bothSelectedCurrencyBox").hidden = false;
            document.getElementById("currencyConverterLoader").hidden = true;
        }
    }else{
        fetch(`https://v6.exchangerate-api.com/v6/${window.atob(CURRENCY_KEY)}/pair/${cur1}/${cur2}`)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            return null;
        })
        .then(function(rawData) {
            const data = rawData["conversion_rate"]
            if (data){
                exchangeRate = data;
                if (data != 0){
                    reciprocal = 1/data;
                }else{
                    reciprocal = 0; 
                }

                document.getElementById("country2CurrencyAmount").innerHTML = (exchangeRate).toFixed(3);
                document.getElementById("exchangeRateSuccess").hidden = false;
                document.getElementById("exchangeRateFail").hidden = true;
                document.getElementById("NoExchangeRate").hidden = true;
            }else {
                document.getElementById("exchangeRateSuccess").hidden = true;
                document.getElementById("exchangeRateFail").hidden = false;
                document.getElementById("NoExchangeRate").hidden = true;
            }
            document.getElementById("bothSelectedCurrencyBox").hidden = false;
            document.getElementById("currencyConverterLoader").hidden = true;
        })
        .catch(err => {
            console.log(err);
            document.getElementById("exchangeRateSuccess").hidden = true;
            document.getElementById("exchangeRateFail").hidden = false;
            document.getElementById("NoExchangeRate").hidden = true;

            document.getElementById("bothSelectedCurrencyBox").hidden = false;
            document.getElementById("currencyConverterLoader").hidden = true;
        });
    }
}