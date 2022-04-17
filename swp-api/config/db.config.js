module.exports = {
  HOST: "127.0.0.1",
  USER: "db_user",
  PASSWORD: "db_user_password",
  DB: "test_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
