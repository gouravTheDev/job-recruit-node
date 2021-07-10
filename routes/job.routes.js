var express = require("express");
var router = express.Router();
const multer = require("multer");
const request_param = multer();
const jobController = require("../controllers/job.controller");

// Job list
router.get(
  "/job/list",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobController.list(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Create Job
router.post(
  "/job/create",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobController.save(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Update Job
router.post(
  "/job/update",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobController.update(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);

// Delete Job
router.post(
  "/job/delete-job",
  request_param.any(),
  auth.authenticateAPI,
  async (req, res) => {
    try {
      const success = await jobController.delete(req, res);
      res.status(success.status).send(success);
    } catch (error) {
      res.status(error.status).send(error);
    }
  }
);
module.exports = router;
