'use strict'

// TODO: Require JSON Schema here
const Ajv = require('ajv');
const schema = require('./questionnaireschema.json');
const ajv = Ajv(); // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile(schema);
//var valid = validate(data);
//if (!valid) console.log(validate.errors);

module.exports = (mongodbUrl) => {

  const bl = require('./bl.js')(mongodbUrl);

  async function getQuestionnaires() {
    let questionnaires = await bl.getQuestionnaires();
    // TODO: Perhaps validate also outgoing response?
    // validateSchmema(quesitonnaires, quesionnairesSchema);
    return questionnaires;
  }

  return {
    getQuestionnaires: getQuestionnaires
  };
}