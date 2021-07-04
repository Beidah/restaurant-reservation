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

function hasReservationId(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: "No data sent"
    });
  }

  const reservation_id = data.reservation_id;

  if (!reservation_id) {
    return next({
      status: 400,
      message: "Missing property `reservation_id`"
    });
  }

  res.locals.reservation_id = reservation_id;
  return next();
}

async function reservationExists(req, res, next) {
  const reservationService = require("../reservations/reservations.service");

  try {
    const reservation = await reservationService.read(res.locals.reservation_id);

    if (!reservation) {
      return next({
        status: 404,
        message: `Reservation ${res.locals.reservation_id} not found`
      });
    }

    res.locals.reservation = reservation;
    return next();
  } catch (message) {
    console.error(message);
    return next({
      status: 500,
      message
    });
  }
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;

  try {
    const table = await service.read(table_id);

    if (!table) {
      return next({
        status: 404,
        message: `Table ${table_id} not found`
      });
    }

    res.locals.table_id = table_id;
    res.locals.table = table;
    return next();
  } catch(message) {
    console.error(message);
    return next({
      status: 500,
      message
    });
  }
}

async function tableIsFree(req, res, next) {
  const { table } = res.locals;

  if (!table.free) {
    return next({
      status: 400,
      message: `Table ${table.table_id} is occupied`
    });
  }

  return next();
}

async function tableHasCapacity(req, res, next) {
  const { table, reservation } = res.locals;

  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Table ${table.table_id} does not have the capacity to seat resrvation ${reservation.reservation_id}`
    });
  }

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
    res.status(201).json({ data });
  } catch (message) {
    console.error(message);
    return next({
      status: 500,
      message
    })
  }
}

async function seat(req, res, next) {
  const { table_id, reservation_id } = res.locals;
  
  const data = service.seat(table_id, reservation_id);
  return res.sendStatus(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasProperties, validateTableName, asyncErrorBoundary(create)],
  seat: [
    hasReservationId, 
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(tableIsFree),
    asyncErrorBoundary(tableHasCapacity),
    asyncErrorBoundary(seat)
  ]
}