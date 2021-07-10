const mongoose = require("mongoose");
const JobApplication = require("../models/job_application.model");

const JobApplicationRepository = {

  getById: async (id) => {
    let record = await JobApplication.findById(id).lean().exec();
    try {
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      return e;
    }
  },

  getByField: async (params) => {
    let record = await JobApplication.findOne(params).exec();
    try {
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      return e;
    }
  },

  getAllByField: async (params) => {
    let record = await JobApplication.find(params)
      .sort({
        title: 1,
      })
      .exec();
    try {
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      return e;
    }
  },

  save: async (data) => {
    try {
      let save = await JobApplication.create(data);
      if (!save) {
        return null;
      }
      return save;
    } catch (e) {
      return e;
    }
  },

  getDocumentCount: async (params) => {
    try {
      let recordCount = await JobApplication.countDocuments(params);
      if (!recordCount) {
        return null;
      }
      return recordCount;
    } catch (e) {
      return e;
    }
  },

  delete: async (id) => {
    try {
      let record = await JobApplication.findById(id);
      if (record) {
        let recordDelete = await JobApplication.findByIdAndUpdate(
          id,
          {
            isDeleted: true,
          },
          {
            new: true,
          }
        );
        if (!recordDelete) {
          return null;
        }
        return recordDelete;
      }
    } catch (e) {
      throw e;
    }
  },

  updateById: async (id, data) => {
    try {
      let record = await JobApplication.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      return e;
    }
  },

  updateByField: async (field, fieldValue, data) => {
    //todo: update by field
  },
};

module.exports = JobApplicationRepository;
