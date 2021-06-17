const data = require("./01-reservations.json")

exports.seed = function (knex) {
  knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE");
  return knex("reservations").insert(data);
};
