'use strict'

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = (mongodbUrl) => {

  async function getQuestionnaires() {
    // TODO: Mongodb-kutsu
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve("Hello World");
      }, 1000)
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
        });
      });
      resolve(payload.uuid);
    });
  }

  return {
    getQuestionnaires: getQuestionnaires,
    putQuestionnaire: putQuestionnaire
  };
}