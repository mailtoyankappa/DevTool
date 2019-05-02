'use strict';

var cosmos = {};
var documentClient = require("documentdb").DocumentClient;
//var config = require("./config");
var url = require('url');
var fs = require('fs');

//Dev
var endpoint = process.env.HOST || "https://agentactivationchatbotcosmosdb.documents.azure.com:443/";
var primaryKey = process.env.AUTH_KEY || "pJctEFAYsHFbTD66g642WNGKWKwXWf456Faeflr2vs2PSNqThtbAgAmjYAU7MbpYrOZshyPSyR2C8gDRFXQSEQ==";

//var endpoint = process.env.HOST || "https://agentactivationchatbotdbdev2.documents.azure.com:443/";
//var primaryKey = process.env.AUTH_KEY || "vbz3w6WJMk0zijTNLcD3ijcBVfiw7t6GqSl9Xat99udzqAKiEGEzMzHi7Kn5Ux1EiBZIbq2ctAbNmv9RgpZ0Og==";

//var endpoint = process.env.HOST || "https://agentactivationchatbotsnd3.documents.azure.com:443/";
//var primaryKey = process.env.AUTH_KEY || "FDWRtrdZ8Rezzn14eFm8IckxOdCbXhy3udc8oy2kbDZ88BIB6nUOG9EedT0nxfsV5EfcLcp457dagh2IwRR5Zg==";

//snd2
//var endpoint = process.env.HOST || "https://agentactivationchatbotdemo.documents.azure.com:443/";
//var primaryKey = process.env.AUTH_KEY || "ACWw0e3hYlGojikQaWCFJSVO3jMjGDZJ3Fu5rN1x4pvDI42wb3YlYFQeMKV0AwhrZosiN2aGLBI1V6p8KBgOGA==";

var database = {
	"id": "IntentDB"
};
var collection = {
	"id": "intentDB"
};
var collectionLogin = {
	"id": "login"
};

var client = new documentClient(endpoint, { "masterKey": primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${database.id}`;
var collectionUrl = `${databaseUrl}/colls/${collection.id}`;
var collectionLoginUrl = `${databaseUrl}/colls/${collectionLogin.id}`;

/**
 * Get the database by ID, or create if it doesn't exist.
 * @param {string} database - The database to get or create
 */
function getDatabase() {
	//console.log(`Getting database:\n${database.id}\n`);

	return new Promise((resolve, reject) => {
		client.readDatabase(databaseUrl, (err, result) => {
			if (err) {
				if (err.code == HttpStatusCodes.NOTFOUND) {
					client.createDatabase(database, (err, created) => {
						if (err) reject(err)
						else resolve(created);
					});
				} else {
					reject(err);
				}
			} else {
				resolve(result);
			}
		});
		console.log(`database:\n${database.id} connected\n`);
	});
	
}

/**
 * Get the collection by ID, or create if it doesn't exist.
 */
function getCollection() {
	//console.log(`Getting collection:\n${collection.id}\n`);

	return new Promise((resolve, reject) => {
		client.readCollection(collectionUrl, (err, result) => {
			if (err) {
				if (err.code == HttpStatusCodes.NOTFOUND) {
					client.createCollection(databaseUrl, collection, { offerThroughput: 400 }, (err, created) => {
						if (err) reject(err)
						else resolve(created);
					});
				} else {
					reject(err);
				}
			} else {
				resolve(result);
			}
		});
	});
}


/**
 * Get the collection by ID, or create if it doesn't exist.
 */
function getCollectionLogin() {
	//console.log(`Getting collection:\n${collection.id}\n`);

	return new Promise((resolve, reject) => {
		client.readCollection(collectionLoginUrl, (err, result) => {
			if (err) {
				if (err.code == HttpStatusCodes.NOTFOUND) {
					client.createCollection(databaseUrl, collectionLogin, { offerThroughput: 400 }, (err, created) => {
						if (err) reject(err);
						else resolve(created);
					});
				} else {
					reject(err);
				}
			} else {
				resolve(result);
			}
		});
	});
}


/**
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */
function getFamilyDocument(document) {
	var documentUrl = `${collectionUrl}/docs/${document.id}`;
	//console.log('Print document :'+document.id);
	return new Promise((resolve, reject) => {
		client.readDocument(documentUrl, (err, result) => {
			if (err) {
				console.log("read error" + JSON.stringify(err));
				if (err.code == HttpStatusCodes.NOTFOUND) {
					
					client.createDocument(collectionUrl, document, (err, created) => {
						if (err) 
						{
							console.log('family Function : '+JSON.stringify(err));
							reject(err);
							
						}						
						else
						{ resolve(created);
						console.log(created);
						}
					
					});
				} else {
					reject(err);
				}
			} else {
				resolve(result);
			}
		});
	});
};

/**
 * Query the collection using SQL
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */ 
 function getQueryCollection(entity, intent){	 
	   //console.log('querying collection By passing Intent and Entity through KBConnector');			
		try{
			var aEntity = entity;
	    	var aIntent = intent;
			return new Promise((resolve, reject) => {		
				client.queryDocuments(collectionUrl,
				//'SELECT VALUE c.response FROM intentDB c WHERE c.intent = "document.sign" and c.entity = "NA"'
				"SELECT VALUE c.response FROM intentDB c WHERE c.intent='"+aIntent+"' and c.entity='"+aEntity+"'"
				).toArray((err, results) => {
					console.log('results Query aEntity :'+aEntity);				
					resolve(results);
	  		   });
		     });
		}catch(e){
				console.log(e.stacktrace());
		}
    };
	
	
/**
 * Query the collection using SQL
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */ 
 function getQuerySelectionIntent(){		
		try{
			//var aIntent = intent;
			return new Promise((resolve, reject) => {		
				client.queryDocuments(collectionUrl,
				"SELECT distinct VALUE c.intent FROM intentDB c"
				//"SELECT VALUE c.intent FROM intentDB c"
				//"SELECT c.intent, c.entity, c.response FROM intentDBsn c"
				).toArray((err, results) => {
					//console.log('results Query aEntity :'+JSON.stringify(results));	
					//var data = JSON.stringify(results);  
					//fs.writeFileSync('kuri1.json', data); 			
					resolve(results);
	  		   });
		     });
		}catch(e){
				console.log(e.stacktrace());
		}
    };
	
/**
 * Query the collection using SQL
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */ 
 function getQuerySelection(intent){		
		try{
			var aIntent = intent;
			return new Promise((resolve, reject) => {		
				client.queryDocuments(collectionUrl,
				"SELECT VALUE c.intent FROM intentDB c WHERE c.intent='"+aIntent+"'"
				).toArray((err, results) => {
					//console.log('results Query aEntity :'+aIntent);				
					resolve(results);
	  		   });
		     });
		}catch(e){
				console.log(e.stacktrace());
		}
    };
	/**
 * Query the collection using SQL
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */ 
 function getQuerySelectionResponseValidate(intent){		
		try{
			var aIntent = intent;
			return new Promise((resolve, reject) => {		
				client.queryDocuments(collectionUrl,
				"SELECT VALUE c.response FROM intentDB c WHERE c.intent='"+aIntent+"'"
				).toArray((err, results) => {
					//console.log('results Query aEntity :'+aIntent);				
					resolve(results);
	  		   });
		     });
		}catch(e){
				console.log(e.stacktrace());
		}
    };
	
/**
 * Query the collection using SQL
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */ 
 function getQueryAuthorisedUser(username, password){	 			
		try{
			var user = username;	
	    	var pass = password;
			return new Promise((resolve, reject) => {		
				client.queryDocuments(collectionLoginUrl,
				"SELECT VALUE c.id FROM login c WHERE c.username='"+user+"' and c.password='"+pass+"'"
				).toArray((err, results) => {				
					resolve(results);
	  		   });
		     });
		}catch(e){
				console.log(e.stacktrace());
		}
    };

/**
 * Query the collection using SQL
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */ 
 function getQuerySelectionResponse(intent, entity){	 			
		try{
			var aEntity = entity;	
	    	var aIntent = intent;
			return new Promise((resolve, reject) => {		
				client.queryDocuments(collectionUrl,
				"SELECT VALUE c.response FROM intentDB c WHERE c.intent='"+aIntent+"' and c.entity='"+aEntity+"'"
				).toArray((err, results) => {
					//console.log('results Query aEntity :'+results);				
					resolve(results);
	  		   });
		     });
		}catch(e){
				console.log(e.stacktrace());
		}
    };


/**
 * Delete the document by ID.
 */
function deleteFamilyDocument(intent, entity) {
	try{
	var aintent = intent;
	console.log("Delete the entity from database : " + entity);
	var aentity = entity;
	console.log("Delete the intent from database  " + intent);
	var documentID;
	client.queryDocuments(collectionUrl, 
			"SELECT VALUE c.id FROM intentDB c WHERE c.intent='"+aintent+"' and c.entity='"+aentity+"'"
			).toArray(function(err, results) {
		    if(err) return console.log(err);
				documentID = results;	
		    console.log("printing the Document ID :"+documentID);
			var documentUrl = `${collectionUrl}/docs/${documentID}`;
		return new Promise((resolve, reject) => {
			client.deleteDocument(documentUrl, (err, result) => {
			if (err) reject(err);
			else {
				resolve(result);
			}
			});
			console.log(`Deleting document:\n${documentID}\n`);
		});
	});
	}catch(e){
				console.log(e.stacktrace());
		} 
};

/**
 * Update the document by ID.
 */
function updateFamilyDocument(document) {
	try{
	var aintent = document.intent;
	var aentity = document.entity;
	console.log("updating the entity from database : " + aentity);
	console.log("updating the intent from database  " + aintent);
	var documentID;
	client.queryDocuments(collectionUrl, 
			"SELECT VALUE c.id FROM intentDB c WHERE c.intent='"+aintent+"' and c.entity='"+aentity+"'"
			).toArray(function(err, results) {
		    if(err) return console.log(err);
				documentID = results;	
		    console.log("printing the Document ID :"+documentID);
			var documentUrl = `${collectionUrl}/docs/${documentID}`;
		return new Promise((resolve, reject) => {
			client.deleteDocument(documentUrl, (err, result) => {
			if (err) reject(err);
			else{resolve(result);}});			
			client.createDocument(collectionUrl, document, (err, created) => {
			if (err) reject(err);
			else {resolve(created);}});
			console.log(`document updated succesfully :\n${documentID}\n`);
		});
	});
	}catch(e){
				console.log(e.stacktrace());
		} 
};

module.exports = {getDatabase:getDatabase,getCollection:getCollection,getFamilyDocument:getFamilyDocument,getQueryCollection:getQueryCollection,deleteFamilyDocument:deleteFamilyDocument, getQuerySelection:getQuerySelection, getQuerySelectionResponse:getQuerySelectionResponse, updateFamilyDocument:updateFamilyDocument, getQuerySelectionIntent:getQuerySelectionIntent, getQuerySelectionResponseValidate:getQuerySelectionResponseValidate, getCollectionLogin:getCollectionLogin, getQueryAuthorisedUser:getQueryAuthorisedUser};
