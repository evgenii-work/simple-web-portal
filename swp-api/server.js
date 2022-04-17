const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const User = db.user;

if (process.argv.length === 2) {
  db.sequelize.sync();
} else {
  if (process.argv[2] === "init") {
    db.sequelize.sync().then(() => {
      initial();
    });
  }
}

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });

  User.create({
    username: "bob",
    password: bcrypt.hashSync("aaaa1111", 8),
  }).then((user) => {
    user.setRoles([1]);
  });

  User.create({
    username: "admin",
    password: bcrypt.hashSync("asdfasdf1", 8),
  }).then((user) => {
    user.setRoles([1, 3]);
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Simple web portal application." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/admin.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
