const knex = require("../db/connection");

const tableName = "reservations";

function list() {
  return knex(tableName);
}

function create(newReservation) {
  return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then(createdRecords => createdRecords[0])
    .catch(console.error);
}

module.exports = {
  list,
  create
}