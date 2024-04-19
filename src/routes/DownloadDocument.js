const express = require("express");
const {
  DownloadDocuments,
  DeleteDownloadedDocuments,
} = require("../controller/ReportingToolDoc/DownloadDoc");

const docrouter = express.Router();

docrouter.get("/getDocuemnts/employeeId=:employeeId", DownloadDocuments);
docrouter.post(
  "/deleteAllDocuemnts/employeeId=:employeeId",
  DeleteDownloadedDocuments
);

module.exports = docrouter;
