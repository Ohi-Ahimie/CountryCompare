function addCommas(numStr){
    if (numStr.localeCompare("null", undefined, {sensitivity: 'accent'}) === 0 || numStr.localeCompare("Nan", undefined, {sensitivity: 'accent'}) === 0 || numStr.localeCompare("", undefined, {sensitivity: 'accent'}) === 0 || numStr.localeCompare("???", undefined, {sensitivity: 'accent'}) === 0){
        return "???"
    }

    newStr = "";
    strParts = numStr.split(".");

    for(var i = strParts[0].length-1, j = 0;  i >= 0; i--, j++){
        newStr = strParts[0][i] + newStr;
        if((j+1)%3 == 0 && i !=0){
            newStr = "," + newStr;
        }
    }

    if (strParts.length > 1){
        newStr = newStr + "." + strParts[1];
    }

    return newStr;
}

function formatNumbers(numStr){
    if (numStr.localeCompare("null", undefined, {sensitivity: 'accent'}) === 0 || numStr.localeCompare("Nan", undefined, {sensitivity: 'accent'}) === 0 || numStr.localeCompare("", undefined, {sensitivity: 'accent'}) === 0 || numStr.localeCompare("???", undefined, {sensitivity: 'accent'}) === 0){
        return "???"
    }
    else{return numStr;}
}