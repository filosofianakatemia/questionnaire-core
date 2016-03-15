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
  
  async function putQuestionnaire(payload) {
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
      	/*
        db.collection('questionnaires').replaceOne(
          { "uuid": uuid },
          payload, 
          function(err, results) {
            callback(payload.modified);
        });
        */
        db.collection('questionnaires').findOne(
          { "uuid": uuid },
          function(err, doc) {
            if(doc == null){
              callback(uuid);
            }else{
              payload.enabled = doc.enabled;
              db.collection('questionnaires').deleteOne(
               { "uuid": uuid },
               function(err, results) {
                 
               }
              );
              db.collection('questionnaires').insertOne(payload, function(err, result) {
                console.log("UPDATE questionnaire, uuid: "+payload.uuid);
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
  
  return {
    getQuestionnaires: getQuestionnaires,
    putQuestionnaire: putQuestionnaire,
    deleteQuestionnaire: deleteQuestionnaire,
    getQuestionnaire: getQuestionnaire,
    deployQuestionnaire: deployQuestionnaire,
    closeQuestionnaire: closeQuestionnaire,
    updateQuestionnaire: updateQuestionnaire
  };
}