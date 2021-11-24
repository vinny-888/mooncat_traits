const fetch = require('node-fetch');
const fs = require('fs');

let rawdata = fs.readFileSync('mooncats.json');
let rawdataMin = fs.readFileSync('mooncats.min.json');
let tokensData = JSON.parse(rawdata);
let tokensDataMin = JSON.parse(rawdataMin);
let totalTokens = 25439;
console.log('tokensData Count: ', tokensData.length);
console.log('tokensDataMin Count: ', tokensDataMin.length);

// Used to chunk mooncat.json into 3 pieces
// chunk(tokensData);

// Used to combine mooncats_x.json files into a single file
// combine();

if(totalTokens != tokensData.length && totalTokens !== tokensDataMin.length){
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
    let startID = lastToken ? lastToken.details.rescueIndex+1 : 0;
    console.log('Starting at ID: ', startID);
    getNextToken(startID);
}

function getNextToken(tokenID){
    let url = 'https://api.mooncat.community/traits/'+tokenID;
    console.log('Getting:' + url);
    fetch(url)
    .then(res => res.json())
    .then(token => {
        if (tokenID == totalTokens){
            console.log('End: ' + tokenID);
            setTimeout(()=>{
                saveData(tokensData, 'mooncats.json');
                saveData(tokensDataMin, 'mooncats.min.json');
            }, 5000);
        } else {
            // Verbose
            tokensData.push(token);

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
            // Save every 1000 just incase we need to start again
            if(tokenID % 1000 == 0){
                saveData(tokensData, 'mooncats.json');
                saveData(tokensDataMin, 'mooncats.min.json');
            }
            tokenID++;
            setTimeout(()=>{
                getNextToken(tokenID)
            }, 200)
        }
    })
    .catch((err) => {
        console.log('Error: ', err);
        setTimeout(()=>{
            getNextToken(tokenID)
        }, 1000)
    });
}

function combine(){
    let rawdata0 = fs.readFileSync('mooncats_0.json');
    let tokensData0 = JSON.parse(rawdata0);
    let rawdata1 = fs.readFileSync('mooncats_1.json');
    let tokensData1 = JSON.parse(rawdata1);
    let rawdata2 = fs.readFileSync('mooncats_2.json');
    let tokensData2 = JSON.parse(rawdata2);

    let combined = tokensData0.concat(tokensData1).concat(tokensData2);
    saveData(combined, 'mooncats_combined.json');
}

function chunk(tokensData){
    var i,j, temporary, chunk = 8480;
    for (i = 0,j = tokensData.length; i < j; i += chunk) {
        temporary = tokensData.slice(i, i + chunk);
        saveData(temporary, 'mooncats_'+i+'.json');
    }
}
