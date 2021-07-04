import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
// eslint-disable-next-line
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const searchParams = new URLSearchParams(window.location.search);
  const date = searchParams.get("date") || today();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tableError, setTableError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTableError);
    return () => abortController.abort();
  }

  const reservationsComponents = reservations.map((res, key) => {
    return (
      <div className="reservation card" key={key}>
        <div className="card-body">
          <h5 className="card-title">{res.first_name} {res.last_name}</h5>
          <p className="card-text">Reservation for {res.people} at {res.reservation_time}</p>
          <a className="btn" href={`/reservations/${res.reservation_id}/seat`}>Seat</a>
        </div>
      </div>
    );
  });

  const tableComponents = tables.map((table, key) => {
    const status = table.free ? "Free" : "Occupied";
    return (
      <div className="card pl-5 pr-5" key={key} >
        <div className="card-body">
          <h5 className="card-title">{table.table_name}</h5>
          <p className="card-text">Capacity: {table.capacity}</p>
          <p className="card-text">Status: <span data-table-id-status={table.table_id}>{status}</span></p>
        </div>
      </div>
    )
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <h4 className="mb-0">Reservations for date: {date}</h4>
      <div className="d-md-flex mb-3">
        <ErrorAlert error={reservationsError} />
        {reservationsComponents}
        <a className="btn btn-primary mr-3" href={`/dashboard?date=${previous(date)}`}>Previous</a>
        <a className="btn btn-primary mr-3" href={`/dashboard?date=${next(date)}`}>Next</a>
        <a className="btn btn-primary" href={`/dashboard?date=${today()}`}>Today</a>
      </div>
      <h4>Tables</h4>
      <div className="d-md-flex justify-content-around">
        <ErrorAlert error={tableError} />
        {tableComponents}
      </div>
    </main>
  );
}

export default Dashboard;
