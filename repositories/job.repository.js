const mongoose = require("mongoose");
const Job = require("../models/job.model");

const JobRepository = {

  getById: async (id) => {
    let record = await Job.findById(id).lean().exec();
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
    let record = await Job.findOne(params).exec();
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
    let record = await Job.find(params)
      .sort({
        createdAt: -1,
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
      let save = await Job.create(data);
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
      let recordCount = await Job.countDocuments(params);
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
      let record = await Job.findById(id);
      if (record) {
        let recordDelete = await Job.findByIdAndUpdate(
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
      let record = await Job.findByIdAndUpdate(id, data, {
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

module.exports = JobRepository;
