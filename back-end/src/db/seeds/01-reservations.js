const data = require("./01-reservations.json")

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(() => {
      return knex("reservations").insert(data);
    });
};
