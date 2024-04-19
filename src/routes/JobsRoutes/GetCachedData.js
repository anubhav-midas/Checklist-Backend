const express = require("express");
const {
  GetCachedData,
  middleware,
} = require("../../controller/JobsController/CacheController");
const cachedRouter = express.Router();

cachedRouter.get("/alldata", middleware);

module.exports = {
  cachedRouter,
};
