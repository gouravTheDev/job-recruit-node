const jobRepo = require("../repositories/job.repository");
const jobAppRepo = require("../repositories/job_application.repository");
const mongoose = require("mongoose");

class JobController {
  constructor() {}

  async save(req) {
    try {
      let jobData = await jobRepo.save(req.body);
      if (!_.isEmpty(jobData)) {
        return {
          status: 200,
          data: jobData,
          message: "Job has been saved",
        };
      } else {
        return { status: 201, data: {}, message: "Something went wrong!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async update(req) {
    try {
      let jobData = await jobRepo.updateById(req.body._id, req.body);
      if (!_.isEmpty(jobData)) {
        return {
          status: 200,
          data: jobData,
          message: "Job has been updated",
        };
      } else {
        return { status: 201, data: {}, message: "Something went wrong!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async delete(req) {
    try {
      let jobData = await jobRepo.updateById(req.body.id, {
        isDeleted: true,
      });
      if (!_.isEmpty(jobData)) {
        return {
          status: 200,
          data: {},
          message: "Job has been deleted",
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
      let jobData = await jobRepo.getById(req.params.id);
      if (!_.isEmpty(jobData)) {
        return {
          status: 200,
          data: jobData,
          message: "Job has been deleted",
        };
      } else {
        return { status: 201, data: {}, message: "Record not found!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async list(req) {
    try {
      let jobs = await jobRepo.getAllByField({
        isDeleted: false,
      });
      if (!_.isEmpty(jobs)) {
        for (var i = 0; i < jobs.length; i++) {
          let myApplication = await jobAppRepo.getByField({
            job: mongoose.Types.ObjectId(jobs[i]._id),
            user: mongoose.Types.ObjectId(req.user._id),
            isDeleted: false,
          });
          jobs[i] = jobs[i].toObject();
          if (!_.isEmpty(myApplication) && !_.isNull(myApplication)) {
            jobs[i].isApplied = true;
          } else {
            jobs[i].isApplied = false;
          }
        }
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
}

module.exports = new JobController();
