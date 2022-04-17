const { authJwt, verifySignUp } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/api/admin/userlist",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.userList
  );
  app.post(
    "/api/admin/createuser",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkPasswordRules,
      verifySignUp.checkUserRules,
    ],
    controller.createUser
  );
  app.post(
    "/api/admin/updateuser",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkUserRules,
    ],
    controller.updateUser
  );
  app.post(
    "/api/admin/deleteuser",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
};
