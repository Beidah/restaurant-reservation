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

function validateDate(req, res, next) {
  const { reservation_date } = res.locals.data;
  const date = new Date(reservation_date);
  const today = new Date();

  if (date < today) {
    return next({
      status: 400,
      message: `Only future reservations dates are allowed.`
    });
  }
  
  if (date.getDay() === 1) {
    return next({
      status: 400,
      message: `Cannot make a reservation for Tuesday because the restaurant is closed.`
    })
  }

  return next();
}

function validateTime(req, res, next) {
  const { reservation_date, reservation_time } = res.locals.data;
  const date = new Date(reservation_date + " " + reservation_time);
  const today = new Date();

  if (date < today) {
    return next({
      status: 400,
      message: "Only future reservations times are allowed."
    });
  }

  const [hours, minutes] = reservation_time.split(":", 2);
  const res_time = new Date();
  res_time.setHours(Number(hours), Number(minutes));

  const openTime = new Date();
  openTime.setHours(10, 30, 0);

  if (res_time < openTime) {
    return next({
      status: 400,
      message: `The earliest reservation time is 10:30. Received: ${reservation_time}`
    });
  }

  const closeTime = new Date();
  closeTime.setHours(21, 30, 0);

  if (res_time > closeTime) {
    return next({
      status: 400,
      message: `The latest reservation time is 21:30. Received: ${reservation_time}`
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

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`
    });
  }

  res.locals.reservation = reservation;
  return next();
}

// Route handlers

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const date = req.query.date;
  const data = await service.list(date);
    
  res.json({ data });
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

function read(req, res) {
  const data = res.locals.reservation;
  res.json({data})
}

module.exports = {
  list,
  read: [asyncErrorBoundary(reservationExists), read],
  create: [hasProperties, verifyDate, validateDate, verifyTime, validateTime, verifyPeople, asyncErrorBoundary(create)],
};
