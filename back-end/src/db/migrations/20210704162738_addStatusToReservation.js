
exports.up = function(knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.enu("status", ["booked", "finished", "seated", "cancelled"]).defaultTo("booked").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("status");
  });
};
