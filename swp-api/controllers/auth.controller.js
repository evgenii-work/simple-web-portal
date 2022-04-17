const db = require("../models");
const config = require("../config/auth.config");
const jwtConfig = require("../config/auth.jwt.config");

const { user: User, role: Role, refreshToken: RefreshToken } = db;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      res.send({ message: "User was registered successfully!" });
      // UNCOMMENT TO ADD ROLES WHEN SIGNING UP
      // if (req.body.roles) {
      //   Role.findAll({
      //     where: {
      //       name: {
      //         [Op.or]: req.body.roles,
      //       },
      //     },
      //   }).then((roles) => {
      //     user.setRoles(roles).then(() => {
      //       res.send({ message: "User was registered successfully!" });
      //     });
      //   });
      // } else {
      //   user.setRoles([1]).then(() => {
      //     res.send({ message: "User was registered successfully!" });
      //   });
      // }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: jwtConfig.jwtExpiration,
      });
      let refreshToken = await RefreshToken.createToken(user);
      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        if (authorities.includes("admin") && !authorities.includes("user")) {
          authorities.push("user");
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    const user = await refreshToken.getUser();

    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: jwtConfig.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
