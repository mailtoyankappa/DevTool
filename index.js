var path = require('path');
require('dotenv').config();
var parse = require('./luis_module/_parse');
var addEntities = require('./luis_module/_entities');
var addIntents = require('./luis_module/_intents');
var upload = require('./luis_module/_upload');
var train = require('./luis_module/_train');
var publishStart = require('./luis_module/_publish');
const fsi = require('fs');

// Change these values
var LUIS_authoringKey = process.env.LUIS_authoringKey ;     //enter your key here
var LUIS_appName = "Default";                     //Skip this
var LUIS_appCulture = "en-us";                    //Skip this
var LUIS_versionId = process.env.LUIS_versionId;           //Enter Current VersionId of the App

// NOTE: final output of add-utterances api named utterances.upload.json
var downloadFile = "./storageluis/temp.csv";
var uploadFile = "./utterances.json"

// The app ID is returned from LUIS when your app is created
var LUIS_appId = process.env.LUIS_appId;  //Enter Luisappid Here.
var intents = [];
var entities = [];
console.log(process.env)

/* add utterances parameters */
var configAddUtterances = {
    LUIS_subscriptionKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    batchSize: 100,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples"
};

var configPublish = {
    LUIS_subscriptionKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    method: 'POST', // POST to request training, GET to get training status
};

var configTrain = {
    LUIS_authoringKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/train",
    method: 'POST', // POST to request training, GET to get training status
};

/* create app parameters */
var configCreateApp = {
    LUIS_subscriptionKey: LUIS_authoringKey,
    LUIS_versionId: LUIS_versionId,
    appName: LUIS_appName,
    culture: LUIS_appCulture,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/"
};

/* add intents parameters */
var configAddIntents = {
    LUIS_subscriptionKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    intentList: intents,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/intents"
};

/* add entities parameters */
var configAddEntities = {
    LUIS_subscriptionKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    entityList: entities,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/entities"
};

/* input and output files for parsing CSV */


// Parse CSV


var main = async(passintent) => {


    var configParse = {
        inFile: path.join(__dirname, downloadFile),
        outFile: path.join(__dirname, uploadFile),
        passedintent: passintent
    };

    return parse(configParse)
    .then((model) => {
        // Save intent and entity names from parse
        intents = model.intents;
        entities = model.entities;
        // Create the LUIS app
   

    }).then(() => {
        // Add intents
        LUIS_appId = LUIS_appId;
        configAddIntents.LUIS_appId = LUIS_appId ;
        configAddIntents.intentList = intents;
        return addIntents(configAddIntents);

    }).then(() => {
        // Add entities
        configAddEntities.LUIS_appId = LUIS_appId;
        configAddEntities.entityList = entities;
        return addEntities(configAddEntities);

    }).then(() => {
        // Add example utterances to the intents in the app
        configAddUtterances.LUIS_appId = LUIS_appId;
        return upload(configAddUtterances);

    }).then(() => {
        // Add example utterances to the intents in the app
        return train(configTrain);

    }).then(() => {
        // Add example utterances to the intents in the app
        return publishStart(configPublish);

    }).then(() => {
        // Add example utterances to the intents in the app
        return publishStart(configPublish);

    }).then(() => {
        fsi.unlinkSync("./storageluis/temp.csv");// removing the file from the storage

    }).then(() => {
        return "done";// removing the file from the storage

    }).catch(err => {
        console.log(err.message);
    });

    };
    
module.exports = main;
