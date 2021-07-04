const knex = require("../db/connection");
const tableName = "tables";

function list() {
  return knex(tableName).select("*").orderBy("table_name");
}

function read(table_id) {
  return knex(tableName).select("*").where({ table_id }).first();
}

async function create(newTable) {
  try {
    const createdRecords = await knex(tableName)
      .insert(newTable)
      .returning("*");
    return createdRecords[0];
  } catch (message) {
    return console.error(message);
  }
}

async function seat(table_id, reservation_id) {
  return knex(tableName)
    .where({ table_id })
    .update({
      reservation_id,
      free: false,
    }, ["*"]);
}

async function free(table_id) {
  return knex(tableName)
    .where({ table_id })
    .update({
      reservation_id: null,
      free: true
    });
}

module.exports = {
  list,
  read,
  create,
  seat,
  free
}