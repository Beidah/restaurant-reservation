const knex = require("../db/connection");

const tableName = "reservations";

function list(date) {
  if (!date) {
    return knex(tableName)
      .select("*");
  }
  
  return knex(tableName)
    .select("*")
    .where("reservation_date", date)
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex(tableName)
    .select("*")
    .where("reservation_id", reservation_id)
    .first();
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
  read,
  create
}