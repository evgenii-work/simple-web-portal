const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    next();
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

var passwordValidator = require("password-validator");

checkPasswordRules = (req, res, next) => {
  if (!doCheckPasswordRules(req)) {
    res.status(400).send({
      message: "Password validation failed!",
    });
  }
  next();
};

var passwordSchema = new passwordValidator();
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(40) // Maximum length 100
  .has()
  .digits(1); // Must have at least 2 digits

doCheckPasswordRules = (req) => {
  return passwordSchema.validate(req.body.password);
};

checkUserRules = (req, res, next) => {
  if (!doCheckUserRules(req)) {
    res.status(400).send({
      message: "Username validation failed!",
    });
  }
  next();
};

var userSchema = new passwordValidator();
userSchema
  .is()
  .min(3) // Minimum length 8
  .is()
  .max(20); // Maximum length 100

doCheckUserRules = (req) => {
  return userSchema.validate(req.body.username);
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkPasswordRules: checkPasswordRules,
  checkUserRules: checkUserRules,
  doCheckPasswordRules: doCheckPasswordRules,
  doCheckUserRules: doCheckUserRules,
};

module.exports = verifySignUp;
