'use strict'

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = (mongodbUrl) => {

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
      MongoClient.connect(mongodbUrl, function(err, db) {
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
          console.log("Inserted a questionnaire into the questionnaires collection.");
          callback();
        });
      };
      MongoClient.connect(mongodbUrl, function(err, db) {
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

  return {
    getQuestionnaires: getQuestionnaires,
    putQuestionnaire: putQuestionnaire
  };
}