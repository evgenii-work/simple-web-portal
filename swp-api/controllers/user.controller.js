const { verifySignUp } = require("../middleware");
const db = require("../models");
var bcrypt = require("bcryptjs");

const { user: User } = db;

exports.changePassword = async (req, res) => {
  try {
    if (
      req.body.password.length <= 0 ||
      !verifySignUp.doCheckPasswordRules(req)
    ) {
      res.status(500).send({ message: "Password validation failed!" });
      return;
    }

    let user = await User.findOne({ where: { id: req.body.id } });
    if (user.id !== req.body.id) {
      res.status(500).send({ message: "Invalid token!" });
      return;
    }

    if (req.body.password.length > 0) {
      await User.update(
        { password: bcrypt.hashSync(req.body.password, 8) },
        { where: { id: user.id } }
      );
      res.status(200).send({ message: "Password changed successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: "update error" });
  }
};

exports.getBoard = async (req, res) => {
  try {
    res.status(200).send({ content: "User board content" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "get board error" });
  }
};
