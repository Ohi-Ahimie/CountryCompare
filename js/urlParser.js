/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object} The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var query = url.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}

	return params;
};

function checkParams(){
    params = getParams(window.location);
    
    if(params["country1"]){
        if(params["country1"].localeCompare("random", undefined, {sensitivity: 'accent'}) === 0){
            getRandomCountry(country1);
        }else{
            getCountry(country1, params["country1"]);
        }
    }

    if(params["country2"]){
        if(params["country2"].localeCompare("random", undefined, {sensitivity: 'accent'}) === 0){
            getRandomCountry(country2);
        }else{
            getCountry(country2, params["country2"]);
        }
    }
}

checkParams();