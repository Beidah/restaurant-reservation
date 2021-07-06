
exports.up = function(knex) {
  return knex.schema.alterTable("tables", (table) => {
    table.dropColumn("free");
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable("tables", (table) => {
		table.boolean("free").defaultTo(true);
  })
};
