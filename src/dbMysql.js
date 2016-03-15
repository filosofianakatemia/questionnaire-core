'use strict'

module.exports = (dbUrl) => {
  
  async function getQuestionnaires() {
  	return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function putQuestionnaire(payload) {
    return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function deleteQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function getQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function deployQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function closeQuestionnaire(uuid) {
    return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function updateQuestionnaire(uuid,payload) {
    return new Promise(function(resolve, reject){
      resolve(null);
    });
  }
  
  async function getQuestions(lang,path){
    return new Promise(function(resolve, reject){
      resolve(null);
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