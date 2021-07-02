const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./table.service");

// Middle ware

const properties = ["table_name", "capacity"];

function hasProperties(req, res, next) {
  const { data } = req.body;

  if (!data) {
    next({
      status: 400,
      message: "Missing data"
    });
  }

  for (let propertery of properties) {
    if (!data[propertery]) {
      next({
        status: 400,
        message: `Missing property: ${propertery}`,
      });
    }
  }

  res.locals.data = data;
  return next();
}

function validateTableName(req, res, next) {
  const { data } = res.locals;

  if (data.table_name.length < 2) {
    return next({
      status: 400,
      message: "Property `table_name` must be at least 2 characters long."
    });
  }

  return next();
}


// Route handlers

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res, next) {
  try {
    const data = await service.create(res.locals.data);
    return res.status(201).json({ data });
  } catch (message) {
    console.error(message);
    return next({
      status: 500,
      message
    })
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasProperties, validateTableName, asyncErrorBoundary(create)]
}