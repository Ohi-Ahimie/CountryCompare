let exchangeRate = null;
let reciprocal = null;

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
        fetch("https://currency-exchange.p.rapidapi.com/exchange?q=1.0&from="+cur1+"&to="+cur2, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
                "x-rapidapi-key": "c4bec9a586msh594844373a990ccp14249ejsnf7b1c11c0768"
            }
        })
        .then(response => {
            if (response.ok){
                return response.json();
            }
            return null;
        })
        .then(function(data) {
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