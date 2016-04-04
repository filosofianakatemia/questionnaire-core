'use strict'

module.exports = (dbUrl,usedDatabase) => {

  const database = require('./db.js')(dbUrl,usedDatabase);

	/*
	Generates UUID and Timestamps for a questionnaire
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
			if(payload.created == 1234567){
				payload.created = currentTime;
			}

			payload.modified = currentTime;

			if(payload.uuid == "PLACEHOLDER"){
				payload.uuid = createUuid(); // Generate UUID for Questionnaire
			}

			for(let i = 0;i < payload.pages.length; i++){ // Go through all pages
				if('elements' in payload.pages[i]){ // Check if a page has 'elements'
				let pageElements = payload.pages[i].elements; // Get elements of a page
				for(let a = 0; a < pageElements.length; a++){ // Go through all elements
					if('uuid' in pageElements[a]){ // Check if an element has 'uuid'
						if(pageElements[a].uuid == "PLACEHOLDER"){
							pageElements[a].uuid = createUuid(); // Generate UUID for an element
						}
						if ('options' in pageElements[a]){ // Check if an element has options
							let elementOptions = pageElements[a].options; // Get options of an element
						for(let e = 0; e < elementOptions.length;e++){ // Go through all options
							if('uuid' in elementOptions[e]){ // Check if an option has 'uuid'
								if(elementOptions[e].uuid == "PLACEHOLDER"){
									elementOptions[e].uuid = createUuid(); // Generate UUID for an option
								}
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

  async function getQuestionnaires() {
  	let results = await database.getQuestionnaires();
    return results;
  }

  async function putQuestionnaire(payload) {
    let results = await database.putQuestionnaire(payload);
    return results;
  }

  async function deleteQuestionnaire(uuid){
  	let results = await database.deleteQuestionnaire(uuid);
    return results;
  }

  async function getQuestionnaire(uuid){
  	let results = await database.getQuestionnaire(uuid);
    return results;
  }

  async function deployQuestionnaire(uuid){
    let results = await database.deployQuestionnaire(uuid);
    return results;
  }

  async function closeQuestionnaire(uuid){
    let results = await database.closeQuestionnaire(uuid);
    return results;
  }

  async function updateQuestionnaire(uuid,payload){
    let results = await database.updateQuestionnaire(uuid,payload);
    return results;
  }

  async function getQuestions(lang,path){
    let results = await database.getQuestions(lang,path);
    return results;
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
