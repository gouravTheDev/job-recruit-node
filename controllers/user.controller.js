const userModel = require("../models/user.model");
const userRepo = require("../repositories/user.repository");
const User = new userModel();
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const secret = process.env.SECRET;

class UserController {
  constructor() {}

  async signup(req) {
    try {
      if (!req.body.email) {
        return {
          status: 201,
          data: {},
          message: "Email is required",
        };
      }

      if (!req.body.phone) {
        return {
          status: 201,
          data: {},
          message: "Phone is required",
        };
      }

      let checkPhone = await userRepo.getByField({
        isDeleted: false,
        phone: req.body.phone,
      });

      if (!_.isEmpty(checkPhone) || !_.isNull(checkPhone)) {
        return {
          status: 201,
          data: {},
          message: "This phone is already registered",
        };
      }

      let checkEmail = await userRepo.getByField({
        isDeleted: false,
        email: req.body.email,
      });

      if (!_.isEmpty(checkEmail) || !_.isNull(checkEmail)) {
        return {
          status: 201,
          data: {},
          message: "This email is already registered",
        };
      }

      req.body.password = User.generateHash(req.body.password);
      let userData = await userRepo.save(req.body);
      if (!_.isEmpty(userData)) {
        return {
          status: 200,
          data: userData,
          message: "You have successfully registered",
        };
      } else {
        return { status: 201, data: {}, message: "Something went wrong!" };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async login(req) {
    try {
      let userData = await userRepo.getByField({
        email: req.body.email,
        isDeleted: false,
      });

      if (!_.isEmpty(userData)) {
        if (!userData.validPassword(req.body.password, userData.password)) {
          return {
            status: 201,
            data: {},
            message: "Authentication failed, wrong password.",
          };
        } else {
          const payload = {
            id: userData._id,
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: "7d",
          });
          return {
            status: 200,
            token: token,
            data: userData,
            message: "You have successfully logged in.",
          };
        }
      } else {
        return {
          status: 201,
          data: {},
          message: "Please signup! This email is not registered!",
        };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: "Something went wrong!" };
    }
  }

  async profileDetails(req) {
    console.log(req.user);
    try {
      let userId = req.user._id;
      if (userId) {
        let userDetails = await userRepo.getById(userId);
        if (!_.isEmpty(userDetails) && !_.isNull(userDetails)) {
          return {
            status: 200,
            data: userDetails,
            message: "Details fetched",
          };
        } else {
          return {
            status: 201,
            data: null,
            message: "Could not find record",
          };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: error.message };
    }
  }

  async updateProfile(req) {
    try {
      let logged_in_user = req.user._id;

      var userProfileUpdate = await userRepo.updateById(
        req.body,
        logged_in_user
      );

      if (!_.isEmpty(userProfileUpdate) && !_.isNull(userProfileUpdate)) {
        return {
          status: 200,
          data: userProfileUpdate,
          message: "Profile updated successfully.",
        };
      } else {
        return {
          status: 201,
          data: {},
          message: "We are unable to update the profile, Please try again.",
        };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, data: {}, message: error.message };
    }
  }

  async logout() {
    return {
      status: 200,
      data: {},
      message: "You have successfully logout.",
    };
  }

  async test(req) {
    return {
      status: 200,
      data: req.body,
      message: "You have successfully.",
    };
  }
}

module.exports = new UserController();
