var express = require("express");
var router = express.Router();
const multer = require("multer");
const request_param = multer();
const jobApplicationController = require("../controllers/job-application.controller");

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/resume");
  },
  filename: (req, file, callback) => {
    // callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_"));
  },
});
const uploadFile = multer({
  storage: Storage,
});

// Job Applications
router.get(
  "/job-application/my-list",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobApplicationController.myApplications(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Job Applications
router.get(
  "/job-application/job-list/:id",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobApplicationController.jobApplications(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Job Application details
router.get(
  "/job-application/details/:id",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobApplicationController.details(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Apply Job
router.post(
  "/job-application/apply",
  uploadFile.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobApplicationController.applyJob(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Update Job Application
router.post(
  "/job-application/update",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobApplicationController.updateApplication(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

module.exports = router;
