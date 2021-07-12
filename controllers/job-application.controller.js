const jobApplicationRepo = require("../repositories/job_application.repository");
const jobRepo = require("../repositories/job.repository");
const mongoose = require("mongoose");

class JobApplicationController {
  constructor() {}

  async applyJob(req) {
    try {
      if (_.has(req, "files")) {
        if (req.files.length > 0) {
          req.body.resume = req.files[0].filename;
        }
      }
      req.body.user = req.user._id;
      let jobApplication = await jobApplicationRepo.save(req.body);
      if (!_.isEmpty(jobApplication)) {
        let jobDetails = await jobRepo.getById(req.body.job);
        jobApplication.jobDetails = jobDetails;
        return {
          status: 200,
          data: jobApplication,
          message: "Job application has been saved",
        };
      } else {
        return { status: 201, data: {}, message: "Something went wrong!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async myApplications(req) {
    try {
      let jobs = await jobApplicationRepo.getAllByField({
        user: mongoose.Types.ObjectId(req.user._id),
        isDeleted: false,
      });
      if (!_.isEmpty(jobs)) {
        return {
          status: 200,
          data: jobs,
          message: "Jobs are fetched",
        };
      } else {
        return { status: 201, data: {}, message: "record not found!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async jobApplications(req) {
    try {
      let jobs = await jobApplicationRepo.getAllByField({
        job: mongoose.Types.ObjectId(req.params.id),
        isDeleted: false,
      });
      if (!_.isEmpty(jobs)) {
        return {
          status: 200,
          data: jobs,
          message: "Jobs are fetched",
        };
      } else {
        return { status: 201, data: {}, message: "record not found!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async updateApplication(req) {
    try {
      let jobAppData = await jobApplicationRepo.updateById(
        req.body.id,
        req.body
      );
      if (!_.isEmpty(jobAppData)) {
        return {
          status: 200,
          data: jobAppData,
          message: "Job Application has been updated",
        };
      } else {
        return { status: 201, data: {}, message: "Something went wrong!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async details(req) {
    try {
      let jobAppData = await jobApplicationRepo.getById(req.params.id);
      if (!_.isEmpty(jobAppData)) {
        return {
          status: 200,
          data: jobAppData,
          message: "Job Application data fetched",
        };
      } else {
        return { status: 201, data: {}, message: "Something went wrong!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }
}

module.exports = new JobApplicationController();
