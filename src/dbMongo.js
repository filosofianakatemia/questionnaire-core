'use strict'

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = (dbUrl) => {
  
  async function getQuestionnaires() {
  	return new Promise(function(resolve, reject){
      let findQuestionnaires = function(db, callback) {
        let resultsArray = new Array();
        let cursor = db.collection('questionnaires').find( );
        cursor.each(function(err, doc) {
          if (doc !== null) {
            resultsArray.push(doc);
          } else {
            callback(resultsArray);
          }
        });
      };
      MongoClient.connect(dbUrl, function(err, db) {
        findQuestionnaires(db, function(resultsArray) {
          db.close();
          resolve(resultsArray);
        });
      });
    });
  }
  
  async function pathExists(path,isI18n){
  	return new Promise(function(resolve, reject){
    if(!isI18n){
      MongoClient.connect(dbUrl, function(err, db) {
        db.collection('questionnaires').findOne({"path": path}, function(err,doc){
          if(doc != null){
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    } else {
      MongoClient.connect(dbUrl, function(err, db) {
        db.collection('questionnaires').findOne({"i18n.path": path}, function(err,doc){
          if(doc != null){
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }
    });
  };
  
  async function putQuestionnaire(payload) {
  	let doesPathExist = await pathExists(payload.path,false);
  	
  	if(doesPathExist){
      return new Promise(function(resolve, reject){
      	resolve(false);	  
      });
    } else {
  	  let iterations = payload.i18n.length;
  	  let pathExistBooleanContainer = false;
  	  
  	  for(let i = 0;i<payload.i18n.length;i++){
  	  	doesPathExist = await pathExists(payload.i18n[i].path,true);  
  	  	if(doesPathExist){
  	  	  pathExistBooleanContainer = true;
  	  	}
  	  	if((i+1) == iterations){
  	  	  if(!pathExistBooleanContainer){
            return new Promise(function(resolve, reject){
              let insertQuestionnaire = function(db, callback) {
                db.collection('questionnaires').insertOne(payload, function(err, result) {
                  console.log("INSERT questionnaire, uuid: "+payload.uuid);
                  callback();
                });
              };
              MongoClient.connect(dbUrl, function(err, db) {
      	        insertQuestionnaire(db, function() {
                  db.close();

                  let returnJson = new Object();
                  returnJson.uuid = payload.uuid;
                  returnJson.created = payload.created;
                  returnJson.modified = payload.modified;
                  resolve(JSON.stringify(returnJson));
                });
              });
            });
          } else {
            return new Promise(function(resolve, reject){
      	      resolve(false);	  
            });
          }
        }
      }
    }
  }
  
  async function deleteQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      let deleteQuestionnaire = function(db, callback) {
        db.collection('questionnaires').deleteOne(
          { "uuid": uuid },
          function(err, results) {
            let result = false;
            if(results.deletedCount > 0){
            	result = true;
            	console.log("DELETE questionnaire, uuid: "+uuid);
            }
            callback(result);
          }
        );
      };
      MongoClient.connect(dbUrl, function(err, db) {
        deleteQuestionnaire(db, function(result) {
          db.close();
          resolve(result);
        });
      });
    });
  }
  
  async function getQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      let getQuestionnaire = function(db, callback) {
        db.collection('questionnaires').findOne(
          { "uuid": uuid },
          function(err, doc) {
            if(doc == null){
              callback(uuid);
            }else{
              callback(doc);
            }
          }
        );
      };
      MongoClient.connect(dbUrl, function(err, db) {
        getQuestionnaire(db, function(result) {
          db.close();
          resolve(result);
        });
      });
    });
  }
  
  async function deployQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      let deployQuestionnaire = function(db, callback) {
        db.collection('questionnaires').findOne(
          { "uuid": uuid },
          function(err, doc) {
            if(doc == null){
              callback(uuid);
            }else{
              db.collection('questionnaires').updateOne(
                { "uuid": uuid },
                {
                  $set: { "enabled": true, "modified": Date.now() }
                }, function(err, results) {
                  callback(true);
              });
            }
          }
        );
      };
      MongoClient.connect(dbUrl, function(err, db) {
        deployQuestionnaire(db, function(result) {
          db.close();
          resolve(result);
        });
      });
    });
  }
  
  async function closeQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      let closeQuestionnaire = function(db, callback) {
        db.collection('questionnaires').findOne(
          { "uuid": uuid },
          function(err, doc) {
            if(doc == null){
              callback(uuid);
            }else{
              db.collection('questionnaires').updateOne(
                { "uuid": uuid },
                {
                  $set: { "enabled": false, "modified": Date.now() }
                }, function(err, results) {
                  callback(true);
              });
            }
          }
        );
      };
      MongoClient.connect(dbUrl, function(err, db) {
        closeQuestionnaire(db, function(result) {
          db.close();
          resolve(result);
        });
      });
    });
  }
  
  async function updateQuestionnaire(uuid,payload) {
    return new Promise(function(resolve, reject){
      let closeQuestionnaire = function(db, callback) {
        db.collection('questionnaires').findOne(
          { "uuid": uuid },
          function(err, doc) {
            if(doc == null){
              callback(uuid);
            }else{
              payload.enabled = doc.enabled;
              db.collection('questionnaires').replaceOne(
                { "uuid": uuid },
                payload,
                function(err, results) {
                  callback(payload.modified);
              });
            }
          }
        );
      };
      MongoClient.connect(dbUrl, function(err, db) {
        closeQuestionnaire(db, function(result) {
          db.close();
          resolve(result);
        });
      });
    });
  }
  
  async function getQuestions(lang,path){
    return new Promise(function(resolve, reject){
      let getQuestionnaire = function(db, callback) {
        db.collection('questionnaires').findOne(
          { "path": path },
          function(err, doc) {
            if(doc == null){
              callback(path);
            }else{
              callback(doc);
            }
          }
        );
      };
      MongoClient.connect(dbUrl, function(err, db) {
        getQuestionnaire(db, function(result) {
          db.close();
          resolve(result);
        });
      });
    });
  }
  
  return {
    getQuestionnaires: getQuestionnaires,
    putQuestionnaire: putQuestionnaire,
    deleteQuestionnaire: deleteQuestionnaire,
    getQuestionnaire: getQuestionnaire,
    deployQuestionnaire: deployQuestionnaire,
    closeQuestionnaire: closeQuestionnaire,
    updateQuestionnaire: updateQuestionnaire,
    getQuestions: getQuestions
  };
}