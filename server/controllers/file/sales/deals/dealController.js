const createDeal = require("./createDeal");
const { getDeals, getDealById, getAllDeals } = require("./readDeal");
const updateDeal = require("./updateDeal");
const deleteDeal = require("./deleteDeal");
const { bulkUpdateDeals, bulkDeleteDeals } = require("./bulkOperations");
const { moveDealStage, bulkMoveDealsStage } = require("./dealStageOperations");

module.exports = {
  createDeal,
  getDeals,
  getDealById,
  getAllDeals,
  updateDeal,
  deleteDeal,
  bulkUpdateDeals,
  bulkDeleteDeals,
  moveDealStage,
  bulkMoveDealsStage,
};
