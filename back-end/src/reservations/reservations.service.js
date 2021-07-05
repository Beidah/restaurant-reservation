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
    .whereNot("status", "finished")
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

function updateStatus(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id })
    .update({ status }, "*")
    .then(updatedRecords => updatedRecords[0]);
}

module.exports = {
  list,
  read,
  create,
  updateStatus
}