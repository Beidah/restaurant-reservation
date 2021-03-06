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
  next();
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
  next();
}

async function reservationExists(req, res, next) {
  const reservationService = require("../reservations/reservations.service");

  const reservation = await reservationService.read(res.locals.reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${res.locals.reservation_id} not found`
    });
  }

  res.locals.reservation = reservation;
  next();
}

function validateReservationStatus(req, res, next) {
  const { reservation } = res.locals;

  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Cannot seat an already seated table"
    });
  }

  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;

  const table = await service.read(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `Table ${table_id} not found`
    });
  }

  res.locals.table_id = table_id;
  res.locals.table = table;
  next();
}

function tableIsFree(req, res, next) {
  const { table } = res.locals;

  if (!table.free) {
    return next({
      status: 400,
      message: `Table ${table.table_id} is occupied`
    });
  }

  next();
}

function tableIsOccupied(req, res, next) {
  const { table } = res.locals;

  if (table.free) {
    return next({
      status: 400,
      message: `Table ${table.table_id} is not occupied`
    });
  }

  next();
}

function tableHasCapacity(req, res, next) {
  const { table, reservation } = res.locals;

  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Table ${table.table_id} does not have the capacity to seat resrvation ${reservation.reservation_id}`
    });
  }

  next();
}

function validateTableName(req, res, next) {
  const { data } = res.locals;

  if (data.table_name.length < 2) {
    return next({
      status: 400,
      message: "Property `table_name` must be at least 2 characters long."
    });
  }

  next();
}


// Route handlers

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res, next) {
  const data = await service.create(res.locals.data);
  res.status(201).json({ data });
}

async function seat(req, res) {
  const { table_id, reservation_id } = res.locals;
  
  const data = await service.seat(table_id, reservation_id);
  return res.status(200).json({ data });
}

function free(req, res, next) {
  service
    .free(res.locals.table_id)
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasProperties, validateTableName, asyncErrorBoundary(create)],
  seat: [
    hasReservationId, 
    asyncErrorBoundary(reservationExists), 
    validateReservationStatus,
    asyncErrorBoundary(tableExists), 
    tableIsFree,
    tableHasCapacity,
    asyncErrorBoundary(seat)
  ],
  free: [asyncErrorBoundary(tableExists), tableIsOccupied, free]
}