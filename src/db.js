'use strict'

module.exports = (dbUrl,usedDatabase) => {
  let database;
  
  if(usedDatabase == "mongo"){
    database = require("./dbMongo.js")(dbUrl);
  } else if (usedDatabase == "mysql"){
    database = require("./dbMysql.js")(dbUrl);
  }
  
  async function getQuestionnaires() {
    let results = await database.getQuestionnaires();
    return results;
  }
  
  async function putQuestionnaire(payload) {
    let results = await database.putQuestionnaire(payload);
    return results; 
  }
  
  async function deleteQuestionnaire(uuid) {
    let results = await database.deleteQuestionnaire(uuid);
    return results;
  }
  
  async function getQuestionnaire(uuid) {
    let results = await database.getQuestionnaire(uuid);
    return results;
  }
  
  async function deployQuestionnaire(uuid) {
    let results = await database.deployQuestionnaire(uuid);
    return results;	
  }
  
  async function closeQuestionnaire(uuid) {
    let results = await database.closeQuestionnaire(uuid);
    return results;
  }
  
  async function updateQuestionnaire(uuid,payload) {
    let results = await database.updateQuestionnaire(uuid,payload);
    return results; 
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