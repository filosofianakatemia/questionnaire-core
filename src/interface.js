'use strict'

// TODO: Require JSON Schema here
const Ajv = require('ajv');
const schema = require('./questionnaire.schema.json');
const ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile(schema);
//var valid = validate(data);
//if (!valid) console.log(validate.errors);

module.exports = (mongodbUrl) => {

  const bl = require('./bl.js')(mongodbUrl);

  function createUuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  /*
  Generates UUID and Timestamps for a new questionnaire
  */
  function generateUuidsAndTimestamps(payload){
  	//let genSchema = require('./generator.schema.json');
  	//let genValidate = ajv.compile(genSchema);
    //if(genValidate(payload)){  //Option 1 for validating payload before generating, Using schema

    if('uuid' in payload &&    //Option 2 for validating payload before generating, Using if
  	  'created' in payload &&
  	  'modified' in payload &&
      'pages' in payload){ // Check if payload has required properties
  	  let currentTime = Date.now();
  	  payload.created = currentTime;
  	  payload.modified = currentTime;

  	  payload.uuid = createUuid(); // Generate UUID for Questionnaire

  	  for(let i = 0;i < payload.pages.length; i++){ // Go through all pages
  	  	if('elements' in payload.pages[i]){ // Check if a page has 'elements'
  		  let pageElements = payload.pages[i].elements; // Get elements of a page
  		  for(let a = 0; a < pageElements.length; a++){ // Go through all elements
  		  	if('uuid' in pageElements[a]){ // Check if an element has 'uuid'
  		      pageElements[a].uuid = createUuid(); // Generate UUID for an element
  		      if ('options' in pageElements[a]){ // Check if an element has options
  		        let elementOptions = pageElements[a].options; // Get options of an element
  			    for(let e = 0; e < elementOptions.length;e++){ // Go through all options
  			      if('uuid' in elementOptions[e]){ // Check if an option has 'uuid'
  			        elementOptions[e].uuid = createUuid(); // Generate UUID for an option
  			      }
  			    }
  		      }
  		    }
  		  }
  	    }
  	  }
  	}
  	return payload;
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
  	payload = generateUuidsAndTimestamps(payload)

  	let valid = validate(payload);
  	let responseFromBl = false;
  	if (valid){
  	  responseFromBl = await bl.putQuestionnaire(payload);
  	} else {
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
        console.log("NOT FOUND in getQuestionnaire, uuid: "+responseFromBl);
        responseFromBl = false;
      } else {
        let valid = validate(responseFromBl);
        if(!valid){
          console.log("INVALID QUESTIONNAIRE in database, uuid: "+responseFromBl);
          console.log(validate.errors);
          responseFromBl = false;
        }
      }
    } else {
      console.log("INVALID UUID in getQuestionnaire, requested uuid: "+uuid);
    }
    return responseFromBl;
  }

  return {
    getQuestionnaires: getQuestionnaires,
    putQuestionnaire: putQuestionnaire,
    deleteQuestionnaire: deleteQuestionnaire,
    getQuestionnaire: getQuestionnaire
  };
}
