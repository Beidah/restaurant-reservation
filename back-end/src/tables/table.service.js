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
  return knex.transaction((trx) => { 
    return trx.table(tableName)
    .where({ table_id })
    .update({
      reservation_id,
      free: false,
    }, ["*"])
    .then((ids) => {
      return trx.table("reservations")
        .where({ reservation_id })
        .update({ status: "seated" });
    })});
}

async function free(table_id) {
  const { reservation_id } = await knex(tableName)
    .where({ table_id })
    .select("reservation_id")
    .first();

  return knex.transaction((trx) => {
    return trx.table(tableName)
      .where({ table_id })
      .update({
        reservation_id: null,
        free: true
      })
      .then(() => {
        return trx.table("reservations")
          .where({ reservation_id })
          .update({ status: "finished" });
      });
  });
}

module.exports = {
  list,
  read,
  create,
  seat,
  free
}