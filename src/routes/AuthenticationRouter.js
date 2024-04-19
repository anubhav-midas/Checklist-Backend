const express = require("express");
const {
  registerValidation,
  validateLogin,
} = require("../validator/AuthValidator");
const {
  AddUser,
  Login,
  GetAllUser,
  EditUserById,
  GetAllManager,
  GetAllAgent,
  VerifyToken,
} = require("../controller/Authentication/AuthenticationController");
const verifyToken = require("../../TokenMiddleware/middleware");
const AuthRouter = express.Router();

AuthRouter.post("/register", registerValidation, AddUser);
AuthRouter.post("/create-user", registerValidation, AddUser);
AuthRouter.post("/login", validateLogin, Login);
AuthRouter.get("/getAllUser", verifyToken, GetAllUser);
AuthRouter.get("/getAllManagers", verifyToken, GetAllManager);
AuthRouter.get("/getAllAgent", verifyToken, GetAllAgent);
AuthRouter.patch("/editUser/:id", EditUserById);
AuthRouter.get("/token/verify", verifyToken, VerifyToken);

module.exports = AuthRouter;
