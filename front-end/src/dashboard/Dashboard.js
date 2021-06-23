import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
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
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationsComponents = reservations.map((res, key) => {
    return (
      <div key={key}>
        <h3>{res.first_name} {res.last_name}</h3>
        <p>Reservation for {res.people} at {res.reservation_time}</p>
      </div>
    )
  })

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservationsComponents}
      <a className="btn btn-primary mr-3" href={`/dashboard?date=${previous(date)}`}>Previous</a>
      <a className="btn btn-primary mr-3" href={`/dashboard?date=${next(date)}`}>Next</a>
      <a className="btn btn-primary" href={`/dashboard?date=${today()}`}>Today</a>
    </main>
  );
}

export default Dashboard;
