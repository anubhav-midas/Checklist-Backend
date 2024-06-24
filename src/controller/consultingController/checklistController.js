const CheckList = require("../../model/SubmitChecklist");
const ListJson = require("../../utils/Checklists.json");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const http = require("https");
const { default: puppeteer } = require("puppeteer");
const checklistJson = require("../../model/Cretechecklist");
const CryptoJS = require("crypto-js");

function makeUserEmail(value) {
  let userEmail = value;

  return {
    get: function () {
      return userEmail;
    },
    set: function (newValue) {
      userEmail = newValue;
    },
  };
}
const wrapper = makeUserEmail("blank");

const makeRTR = (initialValue) => {
  var rtrValue = initialValue;

  return {
    get: () => {
      return rtrValue;
    },
    set: (newValue) => {
      rtrValue = newValue;
    },
  };
};

let wrapperRtr = makeRTR("blank");

const makeMail = (initialValue) => {
  var mailValue = initialValue;

  return {
    get: () => {
      return mailValue;
    },
    set: (newValue) => {
      mailValue = newValue;
    },
  };
};

let wrapperRecruiter = makeMail("blank");

const GetCheckList = async (req, res) => {
  const { checklistitemname } = req.params;

  const findChecklist = await checklistJson.find({});
  var returnJson = findChecklist.filter(
    (item) => item.Listname == checklistitemname
  );
  // var returnJson = checklistJson;

  if (returnJson.length !== 0) {
    res.status(200).json({
      baseResponse: {
        status: 1,
        message: "Json Found Successfully",
      },
      response: returnJson[0],
    });
  } else {
    res.status(404).json({
      baseResponse: {
        status: 0,
        message: "No Json Found with the given name",
      },
      response: [],
    });
  }
};

const GetCheckListtwo = async (req, res) => {
  const { checklistitemname } = req.params;
  const { id } = req.query;

  const secretKey = "secretHello";

  function decryptURL(encryptedURL, secretKey) {
    const decodedURL = decodeURIComponent(encryptedURL);
    const encryptedBase64 = atob(decodedURL); // Decode base64 using `atob` in Node.js
    const bytes = CryptoJS.AES.decrypt(encryptedBase64, secretKey);
    const decryptedURL = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedURL;
  }

  const r = req.query.r || "";
  wrapperRtr.set(r);

  // const recruiterMail = req.query.mail || "";
  // wrapperRecruiter.set(recruiterMail);
  const uId = decryptURL(id, secretKey);
  console.log(uId);
  const recruiterMail = decryptURL(req.query.mail, secretKey);
  wrapperRecruiter.set(recruiterMail);

  console.log("uId", uId);
  console.log("decryptedMail", recruiterMail);

  // console.log("id", id);
  const findChecklist = await checklistJson.find({});
  var returnJson = findChecklist.filter(
    (item) => item.Listname == checklistitemname
  );
  const getMailId = async (paramId) => {
    try {
      const options = {
        method: "GET",
        hostname: "hrmsapi.midastech.org",
        port: 8443,
        path: `/api/v1/user/getUserById/${paramId}`,
        headers: {
          "User-Agent": "insomnia/8.6.1",
          "Content-Type": "application/json",
        },
      };

      const responseData = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          const chunks = [];

          res.on("data", (chunk) => {
            chunks.push(chunk);
          });

          res.on("end", () => {
            const body = Buffer.concat(chunks);
            resolve(body.toString());
          });
        });

        req.on("error", (error) => {
          reject(new Error(`Failed to make API request: ${error.message}`));
        });

        req.end();
      });

      const jsonResponse = JSON.parse(responseData);
      const { email } = jsonResponse.payload;
      return email;
      console.log("jsonResponse", responseData);
    } catch (error) {
      throw new Error(`Error in getMailId: ${error.message}`);
    }
  };

  if (returnJson.length !== 0) {
    // const userId = id;
    getMailId(uId)
      .then((data) => {
        console.log("API response data:", data);
        // userEmail = data;
        wrapper.set("");
        wrapper.set(data.trim());
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    res.status(200).json({
      baseResponse: {
        status: 1,
        message: "Json Found Successfully",
      },
      response: returnJson[0],
    });
  } else {
    res.status(404).json({
      baseResponse: {
        status: 0,
        message: "No Json Found with the given name",
      },
      response: [],
    });
  }
};

const GetFilledCheckList = async (req, res) => {
  const AllChecklist = await CheckList.find({});

  if (AllChecklist.length !== 0) {
    res.status(200).json({
      baseResponse: {
        status: 1,
        message: "Result Found Successfully",
      },
      response: AllChecklist,
    });
  } else {
    res.status(404).json({
      baseResponse: {
        status: 0,
        message: "No Json Found with the given name",
      },
      response: [],
    });
  }
};
const DeleteList = async (req, res) => {
  const { listId } = req.params;
  const AllChecklist = await CheckList.deleteOne({
    _id: listId,
  });

  if (AllChecklist.length !== 0) {
    res.status(200).json({
      baseResponse: {
        status: 1,
        message: "Result Found Successfully",
      },
      response: AllChecklist,
    });
  } else {
    res.status(404).json({
      baseResponse: {
        status: 0,
        message: "No Checklist Found",
      },
      response: [],
    });
  }
};

const SubmitCheckList = async (req, res) => {
  const {
    firstname,
    lastname,
    phoneno,
    email,
    dob,
    ssn,
    references,
    list,
    htmlData,
    listName,
    requestTimeOffDate,
    categoryname,
    address,
  } = req.body;
  if (!email && firstname && lastname && ssn && dob && phoneno) {
    res.status(400).json({
      baseResponse: {
        status: 0,
        message: "Please check your request",
      },
      response: [],
    });
  }

  const typeValue = "Checklist";
  const sendermail = "manualy sent";

  const newCheckList = new CheckList({
    firstname,
    lastname,
    phoneno,
    email,
    dob,
    ssn,
    references,
    listName,
    type: typeValue,
    sentby: sendermail,
    list,
    requestTimeOffDate,
    categoryname,
    address,
  });

  async function createPDF() {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(htmlData, { waitUntil: "networkidle0" });

    // Generate PDF from the HTML content

    await page.pdf({ path: "output.pdf", format: "A3", printBackground: true });

    await browser.close();

    // Return the path to the generated PDF file

    return "output.pdf";
  }

  // Function to send the email with the PDF attachment

  async function sendEmail(pdfPath) {
    var transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // Use SSL/TLS
      auth: {
        user: "skill-checklist@midasconsulting.org", // Your email address
        pass: "Anubhav_123", // Your password
      },
    });

    var mailOptions = {
      from: "skill-checklist@midasconsulting.org",
      to: "skill-checklist@midasconsulting.org",
      subject: `Response Received- ${listName} Skills Checklist`,
      attachments: [
        {
          filename: `${firstname + "-" + lastname + "-" + listName}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.status(404).json({
          baseResponse: {
            status: 0,
            message: error.message,
          },
          response: [],
        });
      } else {
        await newCheckList.save();
        res.status(200).json({
          baseResponse: {
            status: 1,
            message: "Checklist submitted successfully",
          },
          response: newCheckList,
        });
        console.log("Email sent: " + info.response);
      }
    });
  }

  // Main function to create PDF and send email

  async function createPDFAndSendEmail() {
    try {
      const pdfPath = await createPDF();

      await sendEmail(pdfPath);
    } catch (error) {
      console.log("An error occurred:", error);
    }
  }

  // Call the main function

  createPDFAndSendEmail();
};

const SubmitCheckListtwo = async (req, res, userEmail) => {
  const {
    firstname,
    lastname,
    phoneno,
    email,
    dob,
    ssn,
    references,
    list,
    listName,
    htmlData,
    htmlData1,
    requestTimeOffDate,
    categoryname,
    address,
  } = req.body;
  if (!email && firstname && lastname && ssn && dob && phoneno) {
    res.status(400).json({
      baseResponse: {
        status: 0,
        message: "Please check your request",
      },
      response: [],
    });
  }

  const typeValue =
    wrapperRtr.get() === "ortr"
      ? "RTR"
      : wrapperRtr.get() === "nortr"
      ? "Checklist"
      : "Both";

  const sender = wrapperRecruiter.get();

  const newCheckList = new CheckList({
    firstname,
    lastname,
    phoneno,
    email,
    dob,
    ssn,
    references,
    listName,
    type: typeValue,
    sentby: sender,
    list,
    requestTimeOffDate,
    categoryname,
    address,
  });

  async function createPDF(htmlData, filename, format) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(htmlData, { waitUntil: "networkidle0" });

    const pdfPath = `${filename}.pdf`; // Use a unique filename based on 'filename'
    await page.pdf({ path: pdfPath, format: format, printBackground: true });

    await browser.close();

    return pdfPath;
  }

  // Function to send the email with the PDF attachment

  async function sendEmail(pdfPath, rtrPdf) {
    console.log("rtrpdfff", rtrPdf);
    console.log("pdfPath", pdfPath);
    // const userEmail = wrapper.get();
    var attachments = [];
    var transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // Use SSL/TLS
      auth: {
        user: "skill-checklist@midasconsulting.org", // Your email address
        pass: "Anubhav_123", // Your password
      },
      // auth: {
      //   user: "mayank.kumar@midasconsulting.org", // Your email address
      //   pass: "Developer@mannu", // Your password
      // },
    });

    // var mailOptions = {
    //   from: "skill-checklist@midasconsulting.org",
    //   to: "skill-checklist@midasconsulting.org",
    //   subject: `Response Received- ${listName} Skills Checklist`,
    //   attachments: [
    //     {
    //       filename: `${firstname + "-" + lastname + "-" + listName}.pdf`,
    //       path: pdfPath,
    //       contentType: "application/pdf",
    //     },
    //   ],
    // };
    rtrPdf === null
      ? attachments.push({
          filename: `${firstname + "-" + lastname + "-" + listName}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        })
      : pdfPath === null
      ? attachments.push({
          filename: `${firstname}-RTR.pdf`,
          path: rtrPdf,
          contentType: "application/pdf",
        })
      : attachments.push(
          {
            filename: `${firstname + "-" + lastname + "-" + listName}.pdf`,
            path: pdfPath,
            contentType: "application/pdf",
          },
          {
            filename: `${firstname}-RTR.pdf`,
            path: rtrPdf,
            contentType: "application/pdf",
          }
        );

    console.log("attachments", attachments);
    var mailOptions = {
      from: "skill-checklist@midasconsulting.org",
      to: `${wrapper.get()}, skill-checklist@midasconsulting.org`,
      subject: `Response Received- ${listName} Skills Checklist`,
      attachments: attachments,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.status(404).json({
          baseResponse: {
            status: 0,
            message: error.message,
          },
          response: [],
        });
      } else {
        await newCheckList.save();
        res.status(200).json({
          baseResponse: {
            status: 1,
            message: "Checklist submitted successfully",
          },
          response: newCheckList,
        });
        console.log("Email sent: " + info.response);
      }
    });
  }
  // Main function to create PDF and send email

  async function createPDFAndSendEmail() {
    try {
      const pdfPath = await createPDF(htmlData, "pdf1", "A3");
      let rtrPdf = null;

      if (wrapperRtr.get() === "ortr") {
        // Create rtrPdf only if wrapperRtr.get() is "ortr"
        rtrPdf = await createPDF(htmlData1, "pdf2", "A3");
        await sendEmail(null, rtrPdf); // Send only rtrPdf
      } else if (wrapperRtr.get() === "wrtr") {
        // Create rtrPdf if wrapperRtr.get() is "wrtr"
        rtrPdf = await createPDF(htmlData1, "pdf2", "A3");
        await sendEmail(pdfPath, rtrPdf); // Send both pdfPath and rtrPdf
      } else if (wrapperRtr.get() === "nortr") {
        // Send only pdfPath if wrapperRtr.get() is "nortr"
        await sendEmail(pdfPath, null);
      } else {
        // Handle other cases accordingly (if needed)
        console.log("Invalid wrapperRtr.get() value");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  }

  // Call the main function

  createPDFAndSendEmail();
};

const createChecklist = async (req, res) => {
  const { Listname, list } = req.body;
  try {
    const alreasyexits = await checklistJson.findOne({
      Listname,
    });

    if (alreasyexits !== null) {
      res.status(422).json({
        message: "Checklist With This Name Already Exist",
        status: 0,
      });
    } else if (Listname !== "") {
      const newChecklist = new checklistJson({
        Listname,
        list,
      });
      res.status(200).json({
        baseResponse: {
          message: "New checklist created",
          status: "OK",
        },
        payload: await newChecklist.save(),
      });
    } else {
      res.status(200).json({
        baseResponse: {
          message: "Something went wrong",
          status: "ERROR",
        },
        payload: [],
      });
    }
  } catch (error) {
    console.log("error:", error);
  }
};

const getCreatedChecklist = async (req, res) => {
  const getAll = await checklistJson.find({});
  console.log("getAll:", getAll);

  if (getAll.length > 0) {
    res.status(200).json({
      baseResponse: { message: "fetched json ", status: 1 },
      response: getAll,
    });
  } else {
    res
      .status(200)
      .json({ baseResponse: { message: "Something went wrong", status: 0 } });
  }
};
module.exports = {
  createChecklist,
  GetCheckList,
  GetCheckListtwo,
  SubmitCheckList,
  SubmitCheckListtwo,
  GetFilledCheckList,
  DeleteList,
  getCreatedChecklist,
};
