/**
 * Defines the router for table resources.
 * 
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./table.controller");

router.route("/").get(controller.list).post(controller.create);

module.exports = router;

