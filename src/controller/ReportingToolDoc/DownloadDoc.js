const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

const folderpath = path.join(__dirname + "../../../../docImages");
const zip = new JSZip();
const DownloadDocuments = async (req, res, next) => {
  const { employeeId } = req.params;

  let url = `https://api.midascrm.tech/auth/employee/get-all-documents?employeeId=${employeeId}`;

  let options = { method: "GET" };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      if (fs.existsSync("./docImages")) {
        // fs.writeFileSync(
        //   `docImages/${item.documentFileName}`.imageBuffer, () => crossOriginIsolated.
        //   ""
        // );
      } else {
        fs.mkdirSync("./docImages");
        // fs.writeFileSync(`docImages/${item.documentFileName}`, "");
      }

      if (json) {
        json.map((item, index) => {
          const file = fs.createWriteStream(
            `docImages/${item.documentFileName}`
          );
          // const file = fs.createWriteStream(`${item.documentFileName}`);
          https.get(item.documentPath, function (response, archive) {
            response.pipe(file);

            // after download completed close filestream

            file.on("finish", () => {
              zip
                .generateNodeStream({ type: "nodebuffer", streamFiles: true })
                .pipe(fs.createWriteStream("sample.zip"))
                .on("finish", function () {
                  console.log("sample.zip written.");
                });
            });
          });
        });
        res.status(404).json({
          message: "Download Completed Successfully",
          status: 0,
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
          fs.stat(
            `./docImages/${item.documentFileName}`,
            function (err, stats) {
              console.log("stats:", stats); //here we got all information of file in stats variable

              if (err) {
                return console.log("err:err:err:err:");
              }

              fs.unlink(`./docImages/${item.documentFileName}`, function (err) {
                if (err) return console.log("err:", err);
              });
            }
          );
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
