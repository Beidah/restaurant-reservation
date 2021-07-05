import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
// eslint-disable-next-line
import { next, previous, today } from "../utils/date-time";
import TableCard from "../table/TableCard";
import ReservationCard from "../reservations/ReservationCard";

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

  const reservationsComponents = reservations.map((res, key) => <ReservationCard reservation={res} key={res.reservation_id} /> );

  const tableComponents = tables.map((table) => <TableCard key={table.table_id} table={table} setError={setTableError} /> );

  return (
    <main>
      <div className="container">
        <h1>Dashboard</h1>
        <h4 className="mb-0">Reservations for date: {date}</h4>
        <div className="restaurant-list row mb-3">
          <ErrorAlert error={reservationsError} />
          {reservationsComponents}
        </div>
        <div className="buttons mt-3">
          <a className="btn btn-primary mr-3" href={`/dashboard?date=${previous(date)}`}>Previous</a>
          <a className="btn btn-primary mr-3" href={`/dashboard?date=${next(date)}`}>Next</a>
          <a className="btn btn-primary" href={`/dashboard?date=${today()}`}>Today</a>
        </div>
        <h4>Tables</h4>
        <ErrorAlert error={tableError} />
        <div className="row table-list ">
          {tableComponents}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
