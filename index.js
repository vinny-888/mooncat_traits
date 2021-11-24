const fetch = require('node-fetch');
const fs = require('fs');

let rawdata = fs.readFileSync('mooncats.json');
let mooncats = JSON.parse(rawdata);
let tokensData = [];
let tokensDataMin = [];
if(mooncats.length == 0){
    getTokens(); 
}

function getValue(metadata, key){
    let value = '';
    metadata.attributes.forEach((att) => {
        if(key == att.trait_type){
        value = att.value;
        }
    })
    return value;
}

function saveData(tokens, filename){
    try{
        let data = JSON.stringify(tokens);
        fs.writeFileSync(filename, data);
    }catch(err){
      console.log('error:', err);
    }
}

function getTokens(){
    let lastToken = tokensData[tokensData.length-1];
    let startID = lastToken ? lastToken.id : 0;
    console.log('Starting at ID: ', startID);
    getNextToken(startID);
}

function getNextToken(tokenID){
    let url = 'https://api.mooncat.community/traits/'+tokenID;
    console.log('Getting:' + url);
    fetch(url)
    .then(res => res.json())
    .then(token => {
        if (token.error){
        console.log('End: ' + tokenID);
        setTimeout(()=>{
            saveData(tokensData, 'mooncats.json');
        }, 5000);
        } else {
            // Verbose
            tokensData.push(token);
            saveData(tokensData, 'mooncats.json');

            // Minimum
            tokensDataMin.push({
                name: token.name,
                image: token.image,
                animation_url: token.animation_url,
                index: getValue(token, 'Rescue Index'),
                id: getValue(token, 'MoonCat Id'),
                class: getValue(token, 'Classification'),
                year: getValue(token, 'Rescue Year'),
                coat: getValue(token, 'Coat'),
                exp: getValue(token, 'Expression'),
                pose: getValue(token, 'Pose'),
                only: getValue(token, 'Only Child?'),
                twin: getValue(token, 'Has Twins?'),
                mirror: getValue(token, 'Has Mirrors?'),
                clone: getValue(token, 'Has Clones?'),
                pattern: getValue(token, 'Coat Pattern'),
                hue: getValue(token, 'Coat Hue'),
                saturation: getValue(token, 'Coat Saturation')
            });
            saveData(tokensDataMin, 'mooncats.min.json');
            tokenID++;
            getNextToken(tokenID)
        }
    })
    .catch((err) => {
        console.log('Error: ', err);
        setTimeout(()=>{
            getNextToken(tokenID)
        }, 1000)
    });
}
