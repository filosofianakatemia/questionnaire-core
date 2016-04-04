'use strict'

// TODO: Require JSON Schema here
const Ajv = require('ajv');
const schema = require('./questionnaire.schema.json');
const ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile(schema);
//var valid = validate(data);
//if (!valid) console.log(validate.errors);

module.exports = (dbUrl,usedDatabase) => {

  const bl = require('./bl.js')(dbUrl,usedDatabase);

  function createUuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  /*
  Check if given UUID is valid UUID
  */
  function TestUuid(uuid){
    let pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let isValid =  pattern.test(uuid);
    return isValid;
  }

  async function getQuestionnaires() {
    let questionnaires = await bl.getQuestionnaires();
    let validQuestionnaires = new Array();
    for(let i = 0;i<questionnaires.length;i++){
      let valid = validate(questionnaires[i]);
      if (!valid){
        console.log("INVALID QUESTIONNAIRE in database, uuid: "+questionnaires[i].uuid);
        console.log(validate.errors);
  	  } else {
  	    validQuestionnaires.push(questionnaires[i]);
  	  }
    }
    return validQuestionnaires;
  }

  async function putQuestionnaire(payload) {
  	payload = bl.generateUuidsAndTimestamps(payload)

  	let valid = validate(payload);
  	let responseFromBl = false;
  	if (valid){
  	  payload["enabled"] = false;
  	  responseFromBl = await bl.putQuestionnaire(payload);
  	  if(!responseFromBl){
  	    console.log("PATH ALREADY EXISTS in putQuestionnaire");
  	  }
  	} else {
  	  console.log("INVALID QUESTIONNAIRE in putQuestionnaire");
  	  console.log(validate.errors);
  	}
    return responseFromBl;
  }

  async function deleteQuestionnaire(uuid){
  	let isValidUuid = TestUuid(uuid);
  	let responseFromBl = false;
  	if(isValidUuid){
      responseFromBl = await bl.deleteQuestionnaire(uuid);
    } else {
      console.log("INVALID UUID in deleteQuestionnaire, requested uuid: "+uuid);
    }
    return responseFromBl;
  }

  async function getQuestionnaire(uuid){
  	let isValidUuid = TestUuid(uuid);
  	let responseFromBl = false;
  	if(isValidUuid){
      responseFromBl = await bl.getQuestionnaire(uuid);
      if(responseFromBl == uuid){
        console.log("NOT FOUND in getQuestionnaire, uuid: "+uuid);
        responseFromBl = false;
      } else {
        let valid = validate(responseFromBl);
        if(!valid){
          console.log("INVALID QUESTIONNAIRE in database, uuid: "+uuid);
          console.log(validate.errors);
          responseFromBl = false;
        }
      }
    } else {
      console.log("INVALID UUID in getQuestionnaire, requested uuid: "+uuid);
    }
    return responseFromBl;
  }

  async function deployQuestionnaire(uuid){
    let isValidUuid = TestUuid(uuid);
    let responseFromBl = false;
    if(isValidUuid){
      responseFromBl = await bl.deployQuestionnaire(uuid);
      if(responseFromBl == uuid){
        console.log("NOT FOUND in deployQuestionnaire, uuid: "+uuid);
        responseFromBl = false;
      } else {
        responseFromBl = true;
      }
    } else {
      console.log("INVALID UUID in deployQuestionnaire, requested uuid: "+uuid);
    }
    return responseFromBl;
  }

  async function closeQuestionnaire(uuid){
    let isValidUuid = TestUuid(uuid);
    let responseFromBl = false;
    if(isValidUuid){
      responseFromBl = await bl.closeQuestionnaire(uuid);
      if(responseFromBl == uuid){
        console.log("NOT FOUND in closeQuestionnaire, uuid: "+uuid);
        responseFromBl = false;
      } else {
        responseFromBl = true;
      }
    } else {
      console.log("INVALID UUID in closeQuestionnaire, requested uuid: "+uuid);
    }
    return responseFromBl;
  }

  async function updateQuestionnaire(uuid,payload){
    let isValidUuid = TestUuid(uuid);
    if(payload.uuid !== uuid){
      isValidUuid = false;
    }
    let responseFromBl = false;
    if(isValidUuid){
      bl.generateUuidsAndTimestamps(payload); // Generate UUIDs for new elements
      let valid = validate(payload);
      if(!valid){
        console.log("INVALID QUESTIONNAIRE in putQuestionnaire");
        console.log(validate.errors);
      } else {
        responseFromBl = await bl.updateQuestionnaire(uuid,payload);
        if(responseFromBl == uuid){
          console.log("NOT FOUND in updateQuestionnaire, uuid: "+uuid);
          responseFromBl = false;
        }
      }
    } else {
      console.log("INVALID UUID in updateQuestionnaire, requested uuid: "+uuid);
    }
    return responseFromBl;
  }

  async function getQuestions(lang,path){
    let responseFromBl = false;
    responseFromBl = await bl.getQuestions(lang,path);
    return responseFromBl;
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
