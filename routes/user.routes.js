var express = require("express");
var router = express.Router();
const multer = require("multer");
const request_param = multer();
const userController = require("../controllers/user.controller");

// Signin Route
router.post("/user/login", request_param.any(), async (req, res) => {
  try {
    const success = await userController.login(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

// Signup Route
router.post("/user/signup", request_param.any(), async (req, res) => {
  try {
    const success = await userController.signup(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

// Signout Route
router.post("/user/signout", request_param.any(), async (req, res) => {
  try {
    const success = await userController.signout(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

// Get Profile
router.get(
  "/user/get-profile",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await userController.profileDetails(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Update Profile
router.post(
  "/user/update-profile",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await userController.updateProfile(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Test route

router.post("/test", request_param.any(), async (req, res) => {
  try {
    console.log(req.body);
    const success = await userController.test(req, res);
    res.status(success.status).send(success);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

module.exports = router;
