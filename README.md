# api-midalegal.com


const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const path = require("path");
const express = require("express");
const DownloadDocuments = async (req, res, next) => {
  const { employeeId } = req.params;

  let url = `https://api.midascrm.tech/auth/employee/get-all-documents?employeeId=${employeeId}`;

  let options = { method: "GET" };
  global.imageStr = "";
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      if (json) {
        json.map((item, index) => {
          const file = fs.createWriteStream(item.documentFileName);
          https.get(item.documentPath, function (response) {
            response.pipe(file);
            // after download completed close filestream

            file.on("finish", () => {
              file.close();
            });
          });
        });
        res.status(200).json({
          message: "Download Completed",
          status: 1,
        });
      } else {
        res.status(404).json({
          message: "Failed to Download",
          status: 0,
        });
      }
    })
    .catch((err) => console.error("error:" + err));
};
const DeleteDownloadedDocuments = async (req, res, next) => {
  const { employeeId } = req.params;

  let url = `https://api.midascrm.tech/auth/employee/get-all-documents?employeeId=${employeeId}`;

  let options = { method: "GET" };
  global.imageStr = "";
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      if (json) {
        json.map((item, index) => {
          fs.stat(`./${item.documentFileName}`, function (err, stats) {
            console.log("stats:", stats); //here we got all information of file in stats variable

            if (err) {
              return console.log("err:err:err:err:");
            }

            fs.unlink(`./${item.documentFileName}`, function (err) {
              if (err) return console.log("err:", err);
            });
          });
        });
        res.status(200).json({
          message: "File Deleted Successfully",
          status: 1,
        });
      } else {
        res.status(404).json({
          message: "Failed to Download",
          status: 0,
        });
      }
    })
    .catch((err) => console.error("error:" + err));


};

module.exports = {
  DownloadDocuments,
  DeleteDownloadedDocuments,
};
