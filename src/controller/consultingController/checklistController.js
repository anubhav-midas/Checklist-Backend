const CheckList = require("../../model/SubmitChecklist");
const ListJson = require("../../utils/Checklists.json");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const { default: puppeteer } = require("puppeteer");
const checklistJson = require("../../model/Cretechecklist");

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
  const newCheckList = new CheckList({
    firstname,
    lastname,
    phoneno,
    email,
    dob,
    ssn,
    references,
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
        pass: "Beefly@2023", // Your password
      },
      // auth: {
      //   user: "mayank.kumar@midastravel.org", // Your email address
      //   pass: "Mannuk12", // Your password
      // },
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

    // var mailOptions = {
    //   from: "mayank.kumar@midastravel.org",
    //   to: "mayank.kumar@midastravel.org",
    //   subject: `Response Received- ${listName} Skills Checklist`,
    //   attachments: [
    //     {
    //       filename: `${firstname + "-" + lastname + "-" + listName}.pdf`,
    //       path: pdfPath,
    //       contentType: "application/pdf",
    //     },
    //   ],
    // };
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
  SubmitCheckList,
  GetFilledCheckList,
  DeleteList,
  getCreatedChecklist,
};
