const mongoose = require("mongoose");
const User = require("../models/user.model");

const userRepository = {
  getById: async (id) => {
    let user = await User.findById(id).lean().exec();
    try {
      if (!user) {
        return null;
      } else {
        return user;
      }
    } catch (e) {
      return e;
    }
  },

  getByField: async (params) => {
    let user = await User.findOne(params).exec();
    try {
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getAllByField: async (params) => {
    let user = await User.find(params)
      .sort({
        _id: -1,
      })
      .lean()
      .exec();
    try {
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getLimitUserByField: async (params) => {
    let user = await User.find(params)
      .populate("role")
      .limit(5)
      .sort({
        _id: -1,
      })
      .exec();
    try {
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  delete: async (id) => {
    try {
      let user = await User.findById(id);
      if (user) {
        let userDelete = await User.remove({
          _id: id,
        }).exec();
        if (!userDelete) {
          return null;
        }
        return userDelete;
      }
    } catch (e) {
      return e;
    }
  },

  deleteByField: async (field, fieldValue) => {
    //todo: Implement delete by field
  },

  updateById: async (data, id) => {
    try {
      let user = await User.findByIdAndUpdate(id, data, { new: true });
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  updateByField: async (field, fieldValue, data) => {
    try {
      let user = await User.findByIdAndUpdate(fieldValue, field, {
        new: true,
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  save: async (data) => {
    try {
      let user = await User.create(data);

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  forgotPassword: async (params) => {
    try {
      let user = await User.findOne({
        email: params.email_p_c,
      }).exec();
      if (!user) {
        return null;
      } else if (user) {
        let random_pass = Math.random().toString(36).substr(2, 9);
        let readable_pass = random_pass;
        random_pass = user.generateHash(random_pass);

        let user_details = await User.findByIdAndUpdate(user._id, {
          password: random_pass,
        }).exec();
        if (!user_details) {
          return null;
        }
        return readable_pass;
      }
    } catch (e) {
      return e;
    }
  },

  getTotalUsersCount: async (req) => {
    try {
      var and_clauses = [];
      var conditions = {};

      and_clauses.push({
        isDeleted: false,
      });

      conditions["$and"] = and_clauses;
      let users = await User.aggregate([
        {
          $match: conditions,
        },
        {
          $group: {
            _id: "$_id",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]).exec();
      if (users) {
        if (users[0]) {
          if (users[0].count && users[0].count > 0) {
            return users[0].count;
          } else {
            return "0";
          }
        } else {
          return "0";
        }
      } else {
        return "0";
      }
    } catch (e) {
      throw e;
    }
  },

  getActiveUsersCount: async (req) => {
    try {
      var conditions = {
        isActive: true,
      };
      var and_clauses = [];

      and_clauses.push({
        isDeleted: false,
      });
      and_clauses.push({
        "user_role.role": {
          $ne: "admin",
        },
      });

      conditions["$and"] = and_clauses;
      let users = await User.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "user_role",
          },
        },
        {
          $unwind: "$user_role",
        },
        {
          $match: conditions,
        },
        {
          $group: {
            _id: "$user_role._id",
            name: {
              $first: "$user_role.role",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]).exec();
      if (users) {
        if (users[0]) {
          if (users[0].count && users[0].count > 0) {
            return users[0].count;
          } else {
            return "0";
          }
        } else {
          return "0";
        }
      } else {
        return "0";
      }
    } catch (e) {
      throw e;
    }
  },

  getUsersCountWithField: async (req) => {
    try {
      var conditions = req;
      var and_clauses = [];

      and_clauses.push({
        isDeleted: false,
      });
      and_clauses.push({
        "user_role.role": {
          $ne: "admin",
        },
      });

      conditions["$and"] = and_clauses;
      let users = await User.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "user_role",
          },
        },
        {
          $unwind: "$user_role",
        },
        {
          $match: conditions,
        },
        {
          $group: {
            _id: "$user_role._id",
            name: {
              $first: "$user_role.role",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]).exec();
      if (users) {
        if (users[0]) {
          if (users[0].count && users[0].count > 0) {
            return users[0].count;
          } else {
            return "0";
          }
        } else {
          return "0";
        }
      } else {
        return "0";
      }
    } catch (e) {
      throw e;
    }
  },
};

module.exports = userRepository;
