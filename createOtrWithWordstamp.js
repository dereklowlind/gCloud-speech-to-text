const fs = require('fs');

const personName = process.argv[2];
const subFolder = 'subFolder/';
const jsonFileName = subFolder +  personName + '.json';
const otrFileName = subFolder + personName + '.otr';

let rawData = fs.readFileSync(jsonFileName);
let results = JSON.parse(rawData)

let text = '';

let i;
let j;
for( i = 0; i < results.length; i++){
    // check that there are results
    if(results[i].alternatives[0].words != null){
        
        for(j = 0; j < results[i].alternatives[0].words.length; j++){
            // check for time gap
            let seconds = parseFloat(results[i].alternatives[0].words[j].startTime.seconds);
            let nanoseconds = parseFloat(results[i].alternatives[0].words[j].startTime.nanos);
            if(isNaN(seconds)) seconds = 0;
            if(isNaN(nanoseconds)) nanoseconds = 0;
            
            const startOfWord = seconds + nanoseconds/1000000000;

            const word = results[i].alternatives[0].words[j].word;
            // the format for the "wordstamp" feature in my modified version of oTranscribe
            text += '<span class=\"wordstamp\" data-timestamp=\"'+ startOfWord + '\">'+ word + ' ' + '</span>'
        }
        text += '<br />';
    }
    
}

output = {
    "text": text,
    "media": "",
    "media-time": 0,
}


// console.log(output);

fs.writeFileSync(otrFileName, JSON.stringify(output))
