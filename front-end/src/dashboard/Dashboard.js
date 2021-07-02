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
  console.log(date);
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
      <div className="reservation" key={key}>
        <h5>{res.first_name} {res.last_name}</h5>
        <p>Reservation for {res.people} at {res.reservation_time}</p>
        <p>
          <a className="btn" href={`/reservations/${res.reservation_id}/seat`}>Seat</a>
        </p>
      </div>
    );
  });

  const tableComponents = tables.map((table, key) => {
    const status = table.free ? "Free" : "Occupied";
    return (
      <div className="table" key={key} >
        <h5>{table.table_name}</h5>
        <p>Capacity: {table.capacity}</p>
        <p data-table-id-status={table.table_id}>{status}</p>
      </div>
    )
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
        <ErrorAlert error={reservationsError} />
        {reservationsComponents}
        <a className="btn btn-primary mr-3" href={`/dashboard?date=${previous(date)}`}>Previous</a>
        <a className="btn btn-primary mr-3" href={`/dashboard?date=${next(date)}`}>Next</a>
        <a className="btn btn-primary" href={`/dashboard?date=${today()}`}>Today</a>
      </div>
      <div className="d-md-flex">
        <h4>Tables</h4>
        <ErrorAlert error={tableError} />
        {tableComponents}
      </div>
    </main>
  );
}

export default Dashboard;
