// server/controllers/file/support/cases/caseController.js

// Import split controller modules
const createCase = require("./createCase");
const readCase = require("./readCase");
const updateCase = require("./updateCase");
const deleteCase = require("./deleteCase");

// Export all controller functions as a single object
module.exports = {
    getCases: readCase.getCases,
    getCase: readCase.getCase,
    createCase: createCase.createCase,
    updateCase: updateCase.updateCase,
    deleteCase: deleteCase.deleteCase,
    bulkUpdateCases: updateCase.bulkUpdateCases,
    bulkDeleteCases: deleteCase.bulkDeleteCases,
};
