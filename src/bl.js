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
  async function putQuestionnaire() {
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve(true);
      }, 1000)
    });
  }

  return {
    getQuestionnaires: getQuestionnaires,
    putQuestionnaire: putQuestionnaire
  };
}