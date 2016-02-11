'use strict'

// TODO: Require JSON Schema here

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