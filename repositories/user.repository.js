const mongoose = require("mongoose");
const User = require("../models/user.model");

const userRepository = {

  getById: async (id) => {
    let user = await User.findById(id)
      .lean()
      .exec();
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

  getAdminDetails: async () => {
    try {
      var conditions = {
        isActive: true,
      };
      var and_clauses = [];

      and_clauses.push({
        isDeleted: false,
      });
      and_clauses.push({
        "role": "admin",
      });

      conditions["$and"] = and_clauses;
      let users = await User.aggregate([
        {
          $match: conditions,
        },
      ]).exec();
      return users[0];
    } catch (e) {
      throw e;
    }
  },

  getMatches: async (req) => {
    try {
      var conditions = {};
      var and_clauses = [];

      and_clauses.push({ isDeleted: false });
      and_clauses.push({ isActive: true });
      and_clauses.push({ isVerified: true });

      let users = await User.find({
        isDeleted: false,
        isVerified: true,
      })
        .sort({
          _id: -1,
        })
        .lean()
        .exec();

      return null;
    } catch (e) {
      throw e;
    }
  },

  getUsersWithField: async (query) => {
    try {
      var conditions = {};
      var and_clauses = [];

      and_clauses.push({ isDeleted: false });
      and_clauses.push({ isActive: true });
      and_clauses.push({ isVerified: true });

      and_clauses.push({ user_name: { $ne: "" } });
      and_clauses.push({ user_name: { $ne: null } });

      if (_.isObject(query) && _.has(query, "role") && query.role != "") {
        and_clauses.push({
          role: mongoose.Types.ObjectId(query.role),
        });
      }

      and_clauses.push({
        $or: [{ curr_lat: { $ne: "" } }, { curr_lat: { $ne: null } }],
      });

      and_clauses.push({
        $or: [{ curr_long: { $ne: "" } }, { curr_long: { $ne: null } }],
      });

      if (_.isObject(query) && _.has(query, "user_id") && query.user_id != "") {
        and_clauses.push({
          _id: { $ne: mongoose.Types.ObjectId(query.user_id) },
        });
      }

      if (_.isObject(query) && _.has(query, "country") && query.country != "") {
        and_clauses.push({ country: query.country });
      }

      if (
        _.isObject(query) &&
        _.has(query, "blockedUsers") &&
        query.blockedUsers != ""
      ) {
        and_clauses.push({ _id: { $nin: query.blockedUsers } });
      }

      if (_.isObject(query) && _.has(query, "role") && query.role != "") {
        and_clauses.push({ role: query.role });
      }

      and_clauses.push({
        _id: { $ne: query.user_id },
      });
      let checkDistance = true;

      if (_.isObject(query) && _.has(query, "search") && query.search != "") {
        and_clauses.push({
          $or: [
            { full_name: { $regex: query.search, $options: "i" } },
            { user_name: { $regex: query.search, $options: "i" } },
            { first_name: { $regex: query.search, $options: "i" } },
            { last_name: { $regex: query.search, $options: "i" } },
          ],
        });
        checkDistance = false;
      } else {
        if (
          _.isObject(query) &&
          _.has(query, "connection") &&
          query.connection != ""
        ) {
          and_clauses.push({ connection: query.connection });
        }

        if (
          _.isObject(query) &&
          _.has(query, "crossedUsers") &&
          query.crossedUsers != ""
        ) {
          and_clauses.push({ _id: { $nin: query.crossedUsers } });
        }

        if (
          _.isObject(query) &&
          _.has(query, "swipedUsers") &&
          query.swipedUsers != ""
        ) {
          and_clauses.push({ _id: { $nin: query.swipedUsers } });
        }

        if (
          _.isObject(query) &&
          _.has(query, "friends") &&
          query.friends != ""
        ) {
          and_clauses.push({ _id: { $nin: query.friends } });
        }

        if (
          _.isObject(query) &&
          _.has(query, "min_age") &&
          query.min_age != ""
        ) {
          and_clauses.push({ age: { $gte: parseInt(query.min_age) } });
        }

        if (
          _.isObject(query) &&
          _.has(query, "max_age") &&
          query.max_age != ""
        ) {
          and_clauses.push({ age: { $lte: parseInt(query.max_age) } });
        }

        if (
          _.isObject(query) &&
          _.has(query, "lookingForGender") &&
          query.lookingForGender != "" &&
          query.lookingForGender != null
        ) {
          and_clauses.push({
            gender: {
              $regex: new RegExp(`^${query.lookingForGender}$`),
              $options: "i",
            },
          });
        }

        if (
          _.isObject(query) &&
          _.has(query, "ageArr") &&
          !_.isEmpty(query.ageArr) &&
          !_.isNull(query.ageArr)
        ) {
          console.log(query.ageArr);
          let maxAgeArr = [];
          let minAgeArr = [];
          for (let ageEl of query.ageArr) {
            let min_age = ageEl.min_age;

            minAgeArr.push({ age: { $gte: parseInt(min_age) } });
          }

          and_clauses.push({
            $or: minAgeArr,
          });

          for (let ageEl of query.ageArr) {
            let max_age = ageEl.max_age;
            maxAgeArr.push({ age: { $gte: parseInt(max_age) } });
          }

          and_clauses.push({
            $or: maxAgeArr,
          });
        }
      }

      conditions["$and"] = and_clauses;

      var sortOperator = { $sort: { createdAt: -1 } };

      let alldata = User.aggregate([{ $match: conditions }, sortOperator]);

      var options = {
        page: query.page,
        limit: query.limit,
      };

      let usersFetched = await User.aggregatePaginate(alldata, options);

      if (checkDistance && usersFetched.data.length > 0) {
        for (let user of usersFetched.data) {
          if (
            ((user.lat && user.long) || (user.curr_lat && user.curr_long)) &&
            query.lat &&
            query.long
          ) {
            let userLat = null;
            let userLong = null;
            if (
              !user.curr_lat ||
              user.curr_lat == "" ||
              !user.curr_long ||
              user.curr_long == ""
            ) {
              userLat = user.lat;
              userLong = user.long;
            } else {
              userLat = user.curr_lat;
              userLong = user.curr_long;
            }
            let distance = geolib.getDistance(
              { latitude: query.lat, longitude: query.long },
              { latitude: userLat, longitude: userLong }
            );
            distance = (distance / 1000).toFixed(2); // distance converted from meter to km
            if (distance) {
              user.distance = distance.toString();
            }
          } else {
            user.distance = "N/A";
          }
        }

        if (query.distanceToMeasure) {
          var distanceToMeasure = query.distanceToMeasure;
        } else {
          var distanceToMeasure = 500;
        }

        usersFetched.data = usersFetched.data.filter((singleUser) => {
          if (singleUser.distance && singleUser.distance !== "N/A") {
            if (parseInt(singleUser.distance) <= distanceToMeasure) {
              return singleUser;
            }
          } else {
            return singleUser;
          }
        });

        usersFetched.data = sortArray(usersFetched.data, {
          by: "distance",
          order: "asc",
          computed: {
            distance: (row) => row.distance,
          },
        });
      }

      return usersFetched;
    } catch (e) {
      throw e;
    }
  },

  getMatchList: async (query) => {
    try {
      // console.log(query)
      var conditions = {};
      var and_clauses = [];

      and_clauses.push({ isDeleted: false });
      and_clauses.push({ isActive: true });
      and_clauses.push({ isVerified: true });

      if (_.isObject(query) && _.has(query, "role") && query.role != "") {
        and_clauses.push({
          role: mongoose.Types.ObjectId(query.role),
        });
      }

      and_clauses.push({
        likes: { $ne: [] },
      });

      and_clauses.push({
        dislikes: { $ne: [] },
      });

      and_clauses.push({
        fav_meals: { $ne: [] },
      });

      and_clauses.push({
        fav_drinks: { $ne: [] },
      });

      if (_.isObject(query) && _.has(query, "user_id") && query.user_id != "") {
        and_clauses.push({
          _id: { $ne: mongoose.Types.ObjectId(query.user_id) },
        });
      }

      if (_.isObject(query) && _.has(query, "country") && query.country != "") {
        and_clauses.push({ country: query.country });
      }

      if (_.isObject(query) && _.has(query, "friends") && query.friends != "") {
        and_clauses.push({ _id: { $nin: query.friends } });
      }

      if (_.isObject(query) && _.has(query, "matches") && query.matches != "") {
        and_clauses.push({ _id: { $nin: query.matches } });
      }

      if (
        _.isObject(query) &&
        _.has(query, "blockedUsers") &&
        query.blockedUsers != ""
      ) {
        and_clauses.push({ _id: { $nin: query.blockedUsers } });
      }

      if (_.isObject(query) && _.has(query, "min_age") && query.min_age != "") {
        and_clauses.push({ age: { $gte: parseInt(query.min_age) } });
      }

      if (_.isObject(query) && _.has(query, "max_age") && query.max_age != "") {
        and_clauses.push({ age: { $lte: parseInt(query.max_age) } });
      }

      if (_.isObject(query) && _.has(query, "role") && query.role != "") {
        and_clauses.push({ role: query.role });
      }

      and_clauses.push({
        _id: { $ne: query.user_id },
      });

      if (_.isObject(query) && _.has(query, "search") && query.search != "") {
        and_clauses.push({
          $or: [
            { full_name: { $regex: query.search, $options: "i" } },
            { user_name: { $regex: query.search, $options: "i" } },
            { first_name: { $regex: query.search, $options: "i" } },
            { last_name: { $regex: query.search, $options: "i" } },
          ],
        });
      }

      if (
        _.isObject(query) &&
        _.has(query, "lookingForGender") &&
        query.lookingForGender != "" &&
        query.lookingForGender != null
      ) {
        and_clauses.push({
          gender: {
            $regex: new RegExp(`^${query.lookingForGender}$`),
            $options: "i",
          },
        });
      }
      if (
        _.isObject(query) &&
        _.has(query, "connection") &&
        query.connection != ""
      ) {
        and_clauses.push({ connection: query.connection });
      }

      conditions["$and"] = and_clauses;

      var sortOperator = { $sort: { createdAt: -1 } };

      let alldata = User.aggregate([{ $match: conditions }, sortOperator]);

      var options = {
        page: query.page,
        limit: query.limit,
      };
      let usersFetched = await User.aggregatePaginate(alldata, options);

      if (usersFetched.data.length > 0) {
        for (let user of usersFetched.data) {
          if (
            ((user.lat && user.long) || (user.curr_lat && user.curr_long)) &&
            query.lat &&
            query.long
          ) {
            let userLat = null;
            let userLong = null;
            if (
              !user.curr_lat ||
              user.curr_lat == "" ||
              !user.curr_long ||
              user.curr_long == ""
            ) {
              userLat = user.lat;
              userLong = user.long;
            } else {
              userLat = user.curr_lat;
              userLong = user.curr_long;
            }
            let distance = geolib.getDistance(
              { latitude: query.lat, longitude: query.long },
              { latitude: userLat, longitude: userLong }
            );
            distance = (distance / 1000).toFixed(2); // distance converted from meter to km
            if (distance) {
              user.distance = distance.toString();
            }
          } else {
            user.distance = "N/A";
          }
        }

        if (query.distanceToMeasure) {
          var distanceToMeasure = query.distanceToMeasure;
        } else {
          var distanceToMeasure = 500;
        }

        // usersFetched.data = usersFetched.data.filter((singleUser) => {
        //   if (singleUser.distance && singleUser.distance !== "N/A") {
        //     if (parseInt(singleUser.distance) <= distanceToMeasure) {
        //       return singleUser;
        //     }
        //   } else {
        //     return singleUser;
        //   }
        // });
      }

      return usersFetched;
    } catch (e) {
      throw e;
    }
  },

  getUsersByDistance: async (query) => {
    try {
      var conditions = {};
      var and_clauses = [];

      and_clauses.push({ isDeleted: false });
      and_clauses.push({ isActive: true });
      and_clauses.push({ isVerified: true });
      and_clauses.push({ "user_role.role": { $ne: "admin" } });

      conditions["$and"] = and_clauses;

      var sortOperator = { $sort: {} };
      if (_.has(query, "sort")) {
        var sortField = query.sort;
        if (query.sort_type == "desc") {
          var sortOrder = -1;
        } else if (query.sort_type == "asc") {
          var sortOrder = 1;
        }

        sortOperator["$sort"][sortField] = sortOrder;
      } else {
        sortOperator["$sort"]["_id"] = -1;
      }

      let alldata = await User.aggregate([
        { $match: conditions },
        sortOperator,
      ]);

      if (alldata.length > 0) {
        for (let user of alldata) {
          if (
            ((user.lat && user.long) || (user.curr_lat && user.curr_long)) &&
            query.lat &&
            query.long
          ) {
            let userLat = null;
            let userLong = null;
            if (
              !user.curr_lat ||
              user.curr_lat == "" ||
              !user.curr_long ||
              user.curr_long == ""
            ) {
              userLat = user.lat;
              userLong = user.long;
            } else {
              userLat = user.curr_lat;
              userLong = user.curr_long;
            }
            let distance = geolib.getDistance(
              { latitude: query.lat, longitude: query.long },
              { latitude: userLat, longitude: userLong }
            );
            distance = (distance / 1000).toFixed(2); // distance converted from meter to miles
            user.distance = parseFloat(distance);
          } else {
            user.distance = "N/A";
          }
        }
        let distanceToMeasure = 0;

        if (query.distance && query.distance != null && query.distance != "") {
          distanceToMeasure = query.distance;
        } else {
          distanceToMeasure = 100;
        }

        alldata = alldata.filter((user) => {
          // console.log(user.distance)
          if (user.distance && user.distance !== "N/A") {
            if (parseInt(user.distance) <= distanceToMeasure) {
              return user;
            }
          }
        });

        alldata = sortArray(alldata, {
          by: "distance",
          order: "asc",
          computed: {
            distance: (row) => row.distance,
          },
        });
      }

      return alldata;
    } catch (e) {
      throw e;
    }
  },

  getFriendsList: async (req) => {
    try {
      var conditions = {};
      var and_clauses = [];

      and_clauses.push({
        isDeleted: false,
      });

      and_clauses.push({
        _id: req.user._id,
      });

      if (_.isObject(req.body) && _.has(req.body, "search")) {
        and_clauses.push({
          $or: [
            {
              full_name: {
                $regex: req.body.search,
                $options: "i",
              },
            },
          ],
        });
      }

      conditions["$and"] = and_clauses;

      var sortOperator = { $sort: {} };
      if (_.has(req.body, "sort")) {
        var sortField = req.body.sort;
        if (req.body.sort_type == "desc") {
          var sortOrder = -1;
        } else if (req.body.sort_type == "asc") {
          var sortOrder = 1;
        }

        sortOperator["$sort"][sortField] = sortOrder;
      } else {
        sortOperator["$sort"]["_id"] = -1;
      }
      var allRecord = User.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "friends",
            foreignField: "_id",
            as: "friends",
          },
        },
        {
          $match: conditions,
        },
        sortOperator,
      ]);

      return allRecord;
    } catch (e) {
      throw e;
    }
  },
};

module.exports = userRepository;
