const knex = require("../db/connection");

const tableName = "reservations";

function list(date) {
  return knex(tableName)
    .select("*")
    .where("reservation_date", date)
    .orderBy("reservation_time");
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