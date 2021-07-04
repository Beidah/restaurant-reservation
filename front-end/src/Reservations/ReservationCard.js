import React from "react";

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
          <a className="btn btn-primary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a>
        }
      </div>
    </div>
  );
}