import React from "react";
import { updateReservationStatus } from "../utils/api";

export default function ReservationCard({ reservation }) {
  let statusDisplay;

  switch (reservation.status) {
    case "booked":
      statusDisplay = "text-info";
      break;
    case "seated":
      statusDisplay = "text-success";
      break;
    case "finished":
      statusDisplay = "text-warning";
      break;
    default:
      statusDisplay = "text-danger";
      break;
  }

  const onCancel = () => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      updateReservationStatus(reservation.reservation_id, "cancelled")
        .then(() => window.location.reload())
        .catch(console.error)
    }
  }

  return (
    <div className="reservation card">
      <div className="card-header">
        <h5 className="card-title">{reservation.first_name} {reservation.last_name}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">Reservation for {reservation.people} at {reservation.reservation_time}</p>
        <p className="card-text">
          Status:&nbsp;
          <span className={statusDisplay} data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </span>
        </p>
        {reservation.status === "booked" &&
          <>
          <a className="btn btn-primary mr-2" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
          <a className="btn btn-secondary mr-2" href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a>
          <button className="btn btn-danger" data-reservation-id-cancel={reservation.reservation_id} onClick={onCancel}>Cancel</button>
          </>
        }
      </div>
    </div>
  );
}