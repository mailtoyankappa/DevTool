var express = require('express')
	, http = require('http')
	, nconf = require('nconf')
	, path = require('path')
	, everyauth = require('everyauth')
	, Recaptcha = require('recaptcha').Recaptcha;
var app = express();
var request = require('request');
var cors = require('cors');
var path = require('path');
var loki = require('lokijs');
var config=require('config-json');
var AMT = require('./myServer');
var dbcosmos = require('./CosmosDBConnector');
var dbjson = require('./kuri.json');
var fs = require('fs');
var formidable = require('formidable');
var multiparty = require('multiparty');
require('dotenv').config();
var luisfunc = require('./index.js');
var deleteluis = require('./luis_module/deleteintentindex.js');

var NodeCache = require( "node-cache" );
var myCache = new NodeCache();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
var storage = require('azure-storage');

var blobService = storage.createBlobService("agentactivationbotdev", "DHjiBBkCOugpLi2vDopFNXChZ+bkwyGz0/crENiAxHb31r5n4ihLsxU4RKOZBAXIdFz3FPiolyIH2SMUlusuWw==");

//var index = require('index.html');
//LokiDB to communicate with the database

var db = new loki('kuri.json', 
      {	autoload: true,
		//autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 1000
	  });
exports.db = db;
everyauth.debug = true;
//Set the server port (to listen) 
var port = process.env.PORT || 3000;

//To cleat screen
var clear = require('clear');

var dataToSendObject = {
  data: {
    template: {},
    options: {
      title: {
        text: ""
      },
      series: [{}]
    }
  }
};
app.use(cors());
//app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
console.log('hello from server');
  res.render('./public/index.html');
});
/*app.get('/Home',function(req,res){
console.log('hello from server');
  res.sendFile('http://agentmaintenancetool.azurewebsites.net/Home.html');
});*/
app.get('/NewIntent',function(req,res){
	//res.render('NewIntent', { title: 'NewIntent with Me!  ' })
	/*
	app.get('/',function(req, res){
  	res.sendFile(path.join(__dirname+'/index.html'));
	});*/
	 //res.sendFile('/NewIntent.html', { root: __dirname });
  //res.sendFile(path.join(__dirname+'/NewIntent.html'));
  //res.sendFile(path.resolve('NewIntent.html'));
});

app.get('/UpdateIntent',function(req,res){
  //res.sendFile(path.join(__dirname+'/UpdateIntent.html'));
});

app.get('/DeleteIntent',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/AddMultimediaFile',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/AddLink',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/AddIntent',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/UploadExcel',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/EditPolicy',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/EditLink',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});
app.get('/EditMultiMedia',function(req,res){
  //res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});

//Read data from the data base


function dbConnectionObject(){
          dbcosmos.getDatabase()
                  .then(() => dbcosmos.getCollectionLogin());
				  console.log("Login UserDB Connected..!!");
    }
	
	
app.get('/login', function(reqUp, resUp) {	
	console.log("inside the Method : ");
	var username = reqUp.param('username');	
	 console.log("User Name : " + username);
	var password = reqUp.param('password');
	 console.log("password : " + password);
	 try {
	return new Promise((resolve, reject) => {
		dbcosmos.getDatabase()
			.then(() => dbcosmos.getCollection())
			.then(() => dbcosmos.getQueryAuthorisedUser(username, password).then(function (data) {
			data = JSON.stringify(data[0]);
			console.log("Succesful Result :"+JSON.stringify(data));
			//resUp.redirect('/Home');
			resUp.send({data});
            resolve(data);
        }));
	  });
	} catch (e) {
		console.log(e.stacktrace());
	}
});

app.get('/readDataFromDB', function(reqUp, resUp) {	
	var response = {};
	console.log("inside the Method : ");
	//var data = JSON.parse(data);
	var intent = reqUp.param('intent');	
	 console.log("insert intent to database : " + intent);
	// luisfunc(intent);
	var entity = reqUp.param('entity');
	 console.log("insert entity to database : " + entity);
	var responsetagData = reqUp.param('selectResponse');
	 console.log("insert responsetagData to database : " + responsetagData);
	var answertagsData = reqUp.param('answertag');
	 console.log("insert answertagsData to database : " + answertagsData);
	var answerData = reqUp.param('answer');
	 console.log("insert answerData to database : " + answerData);
	var entitytypeData = reqUp.param('entitytype');
	 console.log("insert entitytypeData to database : " + entitytypeData);
	 var linkarraytemplist = reqUp.param('linkarray');
	 var linkarrayData = linkarraytemplist.split(",");
	 console.log("insert linkarrayData to database :" + linkarrayData);
	 var iconarraytemplist = reqUp.param('iconarray');
	 var iconarrayData = iconarraytemplist.split(",");
	 console.log("insert iconarrayData to database : " + iconarrayData);	 
	 var descarraytemplist = reqUp.param('descarray');
	 var descarrayData = descarraytemplist.split(",");
	 console.log("insert descarrayData to database : " + descarrayData);
	 var linkData = reqUp.param('link');
	 console.log("insert linkData to database : " + linkData);
	var linktagData = reqUp.param('linktag');
	 console.log("insert linktagData to database : " + linktagData);
	 
	if(responsetagData == "MultimediaResponse"){
		var answertagsData = "answer,linkarray,iconarray,entity_type,descarray";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, linkarray:linkarrayData, iconarray: iconarrayData, descarray: descarrayData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting MultimediaResponse : "+result);	 
	}/*else if(responsetagData == "PromptsButtons"){
		var answertagsData = "answer,buttons,entity_type";
		var buttonsData = "Create Policy|Retrieve Account Policies|Retrieve Additional Policies";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, buttons:buttonsData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting PromptsButtons : "+result);	
	}*/else if(responsetagData == "Hyperlink"){
		var answertagsData = "answer,link,linktag,entity_type";
		//var linkData = linkarrayData;
		//var linktagData = descarrayData;
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, link:linkData, linktag: linktagData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Hyperlink : "+result);
	}else if(responsetagData == "Text"){
		var answertagsData = "answer,entity_type";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Text : "+result);
	}
	response = result;
	
			/*var data=fs.readFileSync('kuridnsn.json', 'utf8');
			var words=JSON.parse(data);
			console.log(words.length);
			for (var i = 0; i < 103; i++){
			for(var j=0; j<40000; j++){
				//do Nothing 
			}
			intent = words[i].intent;
			//console("intent :"+aIntent);
			entity = words[i].entity;
			//console("aEntity :"+aEntity);
			response = words[i].response;*/
			
			AMT.insertDataincosmos( intent, entity, response );
			//}
			//}
	//Luis call to train and publish
	console.log("the intent is "+intent);
	var temppath = __dirname + '\\storageluis\\temp.csv';
	// 
	if(fs.existsSync(temppath))
	{ 
	console.log(intent);
	 luisfunc(intent);	
	}
	else{
		console.log("no file found");
	}
	resUp.send({intent});
	// console.log("no file");
});

exports.insertDataincosmos = function( intent, entity, response ){
         try{
			var aIntent = intent;
			var aEntity = entity;
			var aResponse = JSON.parse(response);
			//for (var i = 1; i <= 20; i++){
			//console.log('Db Json collection cosmosdata'+JSON.stringify(aResponse));
			dbcosmos.getDatabase()
                             .then(() => dbcosmos.getCollection())
                             .then(() => dbcosmos.getFamilyDocument({intent: aIntent, entity: aEntity, response: aResponse}));
			//luisfunc(intent);
           console.log('Db Json collection cosmosdata');
			//}         
            }catch(e){
				console.log(e.stacktrace());
            }
      };
//
app.get('/callLuisModel', function (reqUp, resUp) {
	var aIntent = reqUp.param('intent');
	Console.log("log in luis :"+aIntent);
	try {
	return new Promise((resolve, reject) => {
		resolve(aIntent);
		});
	} catch (e) {
		console.log(e.stacktrace());
	}
});

//select the entity and response based on intent
app.get('/selectDataIntent', function (reqUp, resUp) {
	//var aIntent = "";// reqUp.param('intent');
	dbConnectionObject();
	var result='';
	try {
	return new Promise((resolve, reject) => {
		dbcosmos.getDatabase()
			.then(() => dbcosmos.getCollection())
			.then(() => dbcosmos.getQuerySelectionIntent().then(function (data) {
			resUp.send({data});
			result=data;
			resolve(data);
        }));
		//console.log('Db Json collection cosmosdata :'+JSON.stringify(result));
		});
	} catch (e) {
		console.log(e.stacktrace());
	}
});

//select the entity and response based on intent
app.get('/selectData', function (reqUp, resUp) {
	var aIntent = reqUp.param('intent');
	var result='';
	try {
	return new Promise((resolve, reject) => {
		dbcosmos.getDatabase()
			.then(() => dbcosmos.getCollection())
			.then(() => dbcosmos.getQuerySelection(aIntent).then(function (data) {
			resUp.send({data});
			result=data;
			resolve(data);
        }));
		//console.log('Db Json collection cosmosdata :'+JSON.stringify(result));
		});
	} catch (e) {
		console.log(e.stacktrace());
	}
});


//select the entity and response based on intent
app.get('/selectDataValidate', function (reqUp, resUp) {
	var aIntent = reqUp.param('intent');
	var result='';
	try {
	return new Promise((resolve, reject) => {
		dbcosmos.getDatabase()
			.then(() => dbcosmos.getCollection())
			.then(() => dbcosmos.getQuerySelectionResponseValidate(aIntent).then(function (data) {
			//console.log('Printing the entity now myServer:' + JSON.stringify(data));
			//$("#entity").val(JSON.stringify(data[0]));			
			resUp.send({data});
			result=data;
			//console.log('inside promise Db Json collection cosmosdata :'+JSON.stringify(result));
			resolve(data);
        }));
		//console.log('Db Json collection cosmosdata :'+JSON.stringify(result));
		});
	} catch (e) {
		console.log(e.stacktrace());
	}
});
//select the entity and response based on intent
app.get('/selectDataResponse', function (reqUp, resUp) {
	var aIntent = reqUp.param('intent');
	var aEntity = reqUp.param('entity');
	try {
	return new Promise((resolve, reject) => {
		dbcosmos.getDatabase()
			.then(() => dbcosmos.getCollection())
			.then(() => dbcosmos.getQuerySelectionResponse(aIntent, aEntity).then(function (data) {
			//console.log('Printing the responsetag now myServer:' + data);			
			data = JSON.stringify(data[0]);
			//console.log('Printing the responsetag now myServer result: '+data);
			resUp.send({data});
            resolve(data);
        }));
	  });
	} catch (e) {
		console.log(e.stacktrace());
	}
});


//Delete Intent  deleteintent
app.get('/deleteChart', function(reqUp, resUp) {
	var intent = reqUp.param('intent');
	var entity = reqUp.param('entity');
	console.log("testing deleteee");
	console.log("intent passed is " + intent);
	//intent="quote.umbrella.legacy-cross";
	var response = '';
	//AMT.insertDataincosmos1(intent, entity, response );
		
	deleteluis(intent).then(function(result) { if (result.includes("Completed")) 
{
    console.log(result);
	resUp.send({
      status: "Ok"
    });
} 
});
	AMT.deleteDataincosmos( intent, entity );
});
exports.deleteDataincosmos = function( intent, entity ){
	var aEntity = entity;
	var aIntent = intent;
	try{
		dbcosmos.getDatabase()
                             .then(() => dbcosmos.getCollection())
                             .then(() => dbcosmos.deleteFamilyDocument(aIntent, aEntity));
           console.log('Db Json collection cosmosdata');         
            }catch(e){
				console.log(e.stacktrace());
            }	
};

//Update a intent in LokiDB
app.get('/updateChart', function(reqUp, resUp) {	
	var response = {};
	console.log("inside the Method : ");
	//var data = JSON.parse(data);
	var intent = reqUp.param('intent');
	 console.log("insert intent to database : " + intent);
	var entity = reqUp.param('entity');
	 console.log("insert entity to database : " + entity);
	var responsetagData = reqUp.param('selectResponse');
	 console.log("insert responsetagData to database : " + responsetagData);
	 var answertagsData = reqUp.param('answertag');
	 console.log("insert answertagsData to database : " + answertagsData);
	 var answerData = reqUp.param('answer');
	 console.log("the answe is "+answerData);
	 console.log("insert answerData to database : " + answerData);
	 var entitytypeData = reqUp.param('entitytype');
	 console.log("insert entitytypeData to database : " + entitytypeData);
	 var linkarraytemplist = reqUp.param('linkarray');
	 var linkarrayData = linkarraytemplist.split(",");
	 console.log("insert linkarrayData to database :" + linkarrayData);
	 var iconarraytemplist = reqUp.param('iconarray');
	 var iconarrayData = iconarraytemplist.split(",");
	 console.log("insert iconarrayData to database : " + iconarrayData);	 
	 var descarraytemplist = reqUp.param('descarray');
	 var descarrayData = descarraytemplist.split(",");
	 console.log("insert descarrayData to database : " + descarrayData);
	 var linkData = reqUp.param('link');
	 console.log("insert linkData to database : " + linkData);
	 var linktagData = reqUp.param('linktag');
	 console.log("insert linktagData to database : " + linktagData);
	 
	if(responsetagData == "MultimediaResponse"){
		var answertagsData = "answer,linkarray,iconarray,entity_type,descarray";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, linkarray:linkarrayData, iconarray: iconarrayData, descarray: descarrayData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting MultimediaResponse : "+result);	 
	}else if(responsetagData == "PromptsButtons"){
		var answertagsData = "answer,buttons,entity_type";
		var buttonsData = "Create Policy|Retrieve Account Policies|Retrieve Additional Policies";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, buttons:buttonsData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting PromptsButtons : "+result);	
	}else if(responsetagData == "Hyperlink"){
		var answertagsData = "answer,link,linktag,entity_type";
		//var linkData = linkarrayData;
		//var linktagData = descarrayData;
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, link:linkData, linktag: linktagData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Hyperlink : "+result);
	}else if(responsetagData == "Text"){
		var answertagsData = "answer,entity_type";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Text : "+result);
	}
	response = result;
	AMT.updateDataincosmos( intent, entity, response );		
	resUp.send({intent});
});

exports.updateDataincosmos = function( intent, entity, response ){
         try{
			var aIntent = intent;
			var aEntity = entity;
			var aResponse = JSON.parse(response);
			console.log('Db Json collection cosmosdata'+aResponse);
			dbcosmos.getDatabase()
                             .then(() => dbcosmos.getCollection())
                             .then(() => dbcosmos.updateFamilyDocument({intent: aIntent, entity: aEntity, response: aResponse}));
           console.log('Db Json collection cosmosdata');         
            }catch(e){
				console.log(e.stacktrace());
            }
      };

//select the entity and response based on intent
app.post('/uploadfileinazure1', function (reqUp, resUp) {	
	console.log("inside the Method : ");
	var form = new formidable.IncomingForm();
	form.parse(reqUp);
	/*var iconarrayData = reqUp.param('iconarray');
	 console.log("insert iconarrayData to database : " + iconarrayData);
	var descarrayData = reqUp.param('descarray');
	 console.log("insert descarrayData to database : " + descarrayData); */
    form.on('fileBegin', function (name, file){
		 file.path = __dirname + '\\storage\\' + file.name;
		 console.log("file path " + file.path);
		 var containerName = "faqstorage";
		 	 
		return new Promise((resolve, reject) => {
	        var fullPath = path.resolve(file.path);
	        var blobName = path.basename(file.name);
			console.log("filePath: " + fullPath);
			console.log("blobName: " + blobName);
	        blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
	            if (err) {
	                reject(err);
	            } else {
	                resolve(blobName);
						resUp.send({blobName});
	            }
	        });
	    //
		});
        //file.path =file.name;
   });
	
	/*form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });*/

	
});


//Trying upload stream for pdf

app.post('/uploadfileinazure', function (req, res) {
    var form = new multiparty.Form();
	 var containerName = "demo";
    form.on('part', function(part) {
        if (part.filename) {
			 var filepath = __dirname + '\\storage\\' + part.filename;
            var size = part.byteCount;
            var name = part.filename;
			console.log("filePath: " + filepath);
			console.log("blobName: " + name);

            blobService.createBlockBlobFromStream(containerName, name, part, size, function(error) {
                if (error) {
                    res.send({ Grrr: error });
                }
            });
        } else {
            form.handlePart(part);
        }
    });
    form.parse(req);
    res.send('OK');
});



//lUIS EXCEL 

app.post('/uploadexcelluis', function (reqUp, resUp) {	
	var response = {};
	console.log("inside the Method : ");
	var form = new formidable.IncomingForm();
	form.parse(reqUp);

    form.on('fileBegin', function (name, file){
		 file.path = __dirname + '\\storageluis\\temp.csv';
		 console.log("file path " + file.path);
    });
	
	form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
		//luisfunc('raahul');
		resUp.send(file.name);
    });	
});


//   *** Start ***
clear(); //clear screen
console.log(' ***** Start session *** ');
console.log(' *****               *** ');
console.log(' ***** Agent Maintaianance Tool *** ');
console.log(' ***** Choose type of Operation in Dash Board *** ');
console.log(' *****               *** ');
app.listen(port);

