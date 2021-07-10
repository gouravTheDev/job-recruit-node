const jobRepo = require("../repositories/job.repository");
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
      let jobData = await jobRepo.updateById(req.body.id, req.body);
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

  async list(req) {
    try {
      let jobs = await jobRepo.getAllByField({
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
}

module.exports = new JobController();
