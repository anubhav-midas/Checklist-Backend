const SeoPagesSchema = require("../../../model/SeoPagesSchema");

const AddAboutus = async (req, res) => {
  try {
    const {
      siteId,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      url,
      content,
      status,
    } = req.body;

    const Aboutus = new SeoPagesSchema({
      siteId,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      url,
      content,

      status,
    });

    const ifAlradyExist = await SeoPagesSchema.find({ title: title });

    if (ifAlradyExist.length >= 1) {
      res.status(422).json({
        message: "Aboutus With This Name Already Exist",
        status: 0,
      });
    } else if (siteId !== "" && url !== "") {
      await Aboutus.save();
      res
        .status(200)
        .json({ baseResponse: { message: "Created Successfuly", status: 1 } });
    } else {
      res
        .status(400)
        .json({ baseResponse: { message: "Bad Request", status: 0 } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ baseResponse: { message: error.message, status: 0 } });
  }
};
const GetAboutus = async (req, res) => {
  const { siteId } = req.params;

  const FindBySiteId = await SeoPagesSchema.findOne({ siteId: siteId });
  try {
    if (FindBySiteId) {
      res.status(200).json({
        baseResponse: {
          message: "Aboutus Fetched Successfuly",
          status: 1,
        },
        response: FindBySiteId,
      });
    } else {
      res
        .status(400)
        .json({ baseResponse: { message: "Not Found", status: 0 } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ baseResponse: { message: error.message, status: 0 } });
  }
};

const EditAboutus = async (req, res) => {
  const { id } = req.params;

  try {
    const { metaTitle, metaDescription, metaKeywords, status } = req.body;

    const ifExist = await SeoPagesSchema.findOneAndUpdate(
      { _id: id },
      {
        status: status,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        metaKeywords: metaKeywords,
      }
    );

    if (ifExist) {
      res
        .status(200)
        .json({ baseResponse: { message: "Updated Successfuly", status: 1 } });
    } else {
      res
        .status(400)
        .json({ baseResponse: { message: "Bad Request", status: 0 } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ baseResponse: { message: error.message, status: 0 } });
  }
};
module.exports = {
  AddAboutus,
  GetAboutus,
  EditAboutus,
};
