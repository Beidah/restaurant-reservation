const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middlewares

const properties = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

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

function verifyDate(req, res, next) {
  const { reservation_date } = res.locals.data;

  if (!Date.parse(reservation_date)) {
    next({
      status: 400,
      message: "Property `reservation_date` needs to be a date."
    });
  }

  return next();
}

function verifyTime(req, res, next) {
  const { reservation_time } = res.locals.data;
  const time_regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  if (!time_regex.test(reservation_time)) {
    return next({
      status: 400,
      message: "Property `reservation_time` needs to be a valid time."
    });
  }

  return next();
}

function verifyPeople(req, res, next) {
  const people = res.locals.data.people;

  if (typeof people !== "number") {
    return next({
      status: 400,
      message: "Property `people` needs to be a number."
    });
  }

  if (people < 1) {
    return next({
      status: 400,
      message: "Property `people` cannot be less than 1."
    });
  }

  res.locals.data.people = people;
  return next();
}

// Route handlers

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

/**
 * Create handler for reservation resources
 */
async function create(req, res, next) {
  try {
    const data =  await service.create(res.locals.data);
    return res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      message: error.error
    });
  }

}

module.exports = {
  list,
  create: [hasProperties, verifyDate, verifyTime, verifyPeople, asyncErrorBoundary(create)],
};
