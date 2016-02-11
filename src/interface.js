'use strict'

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = (mongodbUrl) => {

  async function getQuestionnaires() {
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve("Hello World");
      }, 100)
    });
  }

  return {
    getQuestionnaires: getQuestionnaires
  };
}