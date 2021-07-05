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

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
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
  search,
  read,
  create,
  updateStatus
}