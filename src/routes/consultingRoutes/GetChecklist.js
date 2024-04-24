const express = require("express");

const {
  GetCheckList,
  GetCheckListtwo,
  SubmitCheckList,
  SubmitCheckListtwo,
  GetFilledCheckList,
  DeleteList,
  createChecklist,
  getCreatedChecklist,
} = require("../../controller/consultingController/checklistController");
const mailer = require("../../services/mailer");
const ListRouter = express.Router();
ListRouter.get("/getCheckList/:checklistitemname", GetCheckList);
ListRouter.get("/getCheckList2/:checklistitemname", GetCheckListtwo);
ListRouter.get("/getFilledChecklist", GetFilledCheckList);
ListRouter.post("/submitCheckList", SubmitCheckList);
ListRouter.post("/submitCheckList2", SubmitCheckListtwo);
ListRouter.patch("/deleteList/:listId", DeleteList);
ListRouter.post("/create-checklist", createChecklist);
ListRouter.get("/get-created-checklist", getCreatedChecklist);

module.exports = ListRouter;
