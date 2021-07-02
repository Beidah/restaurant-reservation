const knex = require("../db/connection");
const tableName = "tables";

function list() {
  return knex(tableName).select("*").orderBy("table_name");
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

module.exports = {
  list,
  create
}