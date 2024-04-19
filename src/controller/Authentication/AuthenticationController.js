const AuthSchema = require("../../model/Authentication");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "../../../src/applicationProperties.env",
});

const AddUser = async (req, res) => {
  const { name, email, password, managerId, managerName, roleId, status } =
    req.body;

  const IfAleadyExist = await AuthSchema.findOne({ email: email });

  try {
    if (IfAleadyExist) {
      return res.status(409).json({
        baseResponse: {
          message: "User Already Exist. Please Login",
          status: 1,
        },
      });
    }
    const NewUser = await AuthSchema.create({
      name,
      email: email.toLowerCase(),
      status,
      roleId,
      password,
      managerId,
      managerName,
    });
    if (NewUser) {
      res.status(201).json({
        baseResponse: { message: "User Created Successfully ", status: 1 },
        response: NewUser,
      });
    } else {
      res.status(400).json({
        baseResponse: { message: "No User Was Created", status: 0 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      baseResponse: {
        baseResponse: { message: error.message, status: 0 },
        response: [],
      },
      response: NewUser,
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await AuthSchema.findOne({
    email: email,
    password: password,
  });

  try {
    if (checkUser !== null) {
      const token = jwt.sign(
        { _id: checkUser._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      checkUser.accessToken = token;
      res.status(200).json({
        baseResponse: { message: "User Found Successfully ", status: 1 },
        response: checkUser,
      });
    } else {
      res.status(404).json({
        baseResponse: { message: "User Not Found ", status: 0 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      baseResponse: { message: error.message, status: 1 },
      response: [],
    });
  }
};

const GetAllUser = async (req, res) => {
  const AllUser = await AuthSchema.find({});
  try {
    if (AllUser.length !== 0) {
      res.status(200).json({
        baseResponse: { message: "User Found Successfully ", status: 1 },
        response: AllUser,
      });
    } else {
      res.status(404).json({
        baseResponse: { message: "User Not Found ", status: 0 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      baseResponse: { message: error.message, status: 1 },
      response: [],
    });
  }
};

const GetAllManager = async (req, res) => {
  const AllManager = await AuthSchema.find({ roleId: "2" || 2 });
  try {
    if (AllManager.length !== 0) {
      res.status(200).json({
        baseResponse: { message: "Manager Found Successfully ", status: 1 },
        response: AllManager,
      });
    } else {
      res.status(404).json({
        baseResponse: { message: "User Not Found ", status: 0 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      baseResponse: { message: error.message, status: 1 },
      response: [],
    });
  }
};

const GetAllAgent = async (req, res) => {
  const AllAgent = await AuthSchema.find({ roleId: "3" || 3 });
  try {
    if (AllAgent.length !== 0) {
      res.status(200).json({
        baseResponse: { message: "Agent Found Successfully ", status: 1 },
        response: AllAgent,
      });
    } else {
      res.status(404).json({
        baseResponse: { message: "User Not Found ", status: 0 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      baseResponse: { message: error.message, status: 1 },
      response: [],
    });
  }
};

const EditUserById = async (req, res) => {
  const { id } = req.params;
  const { password, managerId, managerName, roleId } = req.body;

  const AllUser = await AuthSchema.findByIdAndUpdate(
    { id: id },
    {
      password: password,
      managerId: managerId,
      managerName: managerName,
      roleId: roleId,
    }
  );
  try {
    if (AllUser) {
      res.status(200).json({
        baseResponse: { message: "User Edited Successfully ", status: 1 },
        response: AllUser,
      });
    } else {
      res.status(404).json({
        baseResponse: { message: "User Not Found ", status: 0 },
        response: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      baseResponse: { message: error.message, status: 1 },
      response: [],
    });
  }
};
const VerifyToken = async (req, res) => {
  res
    .status(200)
    .json({ baseResponse: { message: "Token Verified", status: 1 } });
};

module.exports = {
  AddUser,
  Login,
  GetAllUser,
  EditUserById,
  GetAllManager,
  GetAllAgent,
  VerifyToken,
};
