const db = require("../models");
const { user: User, role: Role } = db;
const Op = db.Sequelize.Op;
const { verifySignUp } = require("../middleware");
var bcrypt = require("bcryptjs");

exports.userList = async (req, res) => {
  const dbUsers = await User.findAll();
  let userList = [];
  for (let idx = 0; idx < dbUsers.length; ++idx) {
    let u = dbUsers[idx];
    let newUser = { id: u.id, username: u.username, roles: [] };
    let roles = await u.getRoles();
    roles.sort();
    for (let i = 0; i < roles.length; i++) {
      newUser.roles.push(roles[i].name);
    }
    userList.push(newUser);
  }

  res.status(200).send({ users: userList });
};

exports.createUser = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    let roles = [];
    if (req.body.roles.length > 0) {
      roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
    }
    roles.sort();
    await user.setRoles(roles, { transaction: t });

    await t.commit();
    res.status(200).send({ message: "User was created successfully!" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).send({ message: "create error" });
  }
};

exports.updateUser = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    if (
      req.body.password.length > 0 &&
      !verifySignUp.doCheckPasswordRules(req)
    ) {
      res.status(500).send({ message: "Password validation failed!" });
      return;
    }

    let user = await User.findOne({ where: { id: req.body.id } });
    if (user === null) {
      res.status(500).send({ message: "User not found!" });
      return;
    }
    await User.update(
      { username: req.body.username },
      { where: { id: user.id } },
      { transaction: t }
    );

    let roles = [];
    if (req.body.roles.length > 0) {
      roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
    }
    roles.sort();
    await user.setRoles(roles, { transaction: t });

    if (req.body.password.length > 0) {
      await User.update(
        { password: bcrypt.hashSync(req.body.password, 8) },
        { where: { id: user.id } },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).send({ message: "User was updated successfully!" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).send({ message: "update error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.body.id } });
    if (user === null) {
      res.status(500).send({ message: "User not found!" });
      return;
    }

    await User.destroy({ where: { id: req.body.id } });
    res.status(200).send({ message: "User was deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: "delete error" });
  }
};
