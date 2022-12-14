const db = require("../db/connection");

exports.checkUserExists = (username) => {
  const SQL = `SELECT username FROM users;`;
  return db.query(SQL).then(({ rows }) => {
    const isExist = rows.some((user) => user.username === username);
    if (!isExist) {
      return Promise.reject({
        status: 404,
        msg: "User Not Found",
      });
    }
  });
};

exports.getUsersModel = () => {
  const SQL = `SELECT * FROM users`;
  return db.query(SQL).then(({ rows }) => rows);
};
