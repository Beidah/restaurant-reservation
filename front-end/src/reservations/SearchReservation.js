import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationCard from "./ReservationCard";
import ErrorAlert from "../layout/ErrorAlert";

export default function SearchReservation() {
  const [reservations, setReservations] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState(null);

  let resCards;

  if (Array.isArray(reservations)) {
    resCards = reservations.map(res => <ReservationCard key={res.reservation_id} reservation={res} /> );
    if (reservations.length === 0) {
      resCards = <h3>No reservations found</h3>;
    }
  } else {
    resCards = null;
  }

  const onSubmit = (event) => {
    event.preventDefault();

    listReservations({ mobile_phone: mobileNumber })
      .then(setReservations)
      .catch(setError);
  }

  const onChange = (event) => {
    setMobileNumber(event.target.value);
  }

  return (
    <main>
      <ErrorAlert error={error} />
      <form className="mb-5">
        <div className="form-group">
          <label htmlFor="mobile_number" className="sr-only">Mobile Number</label>
          <input 
            name="mobile_number" 
            id="mobile_number" 
            className="form-control mt-3 mr-3" 
            value={mobileNumber}
            onChange={onChange}
            placeholder="Enter a customer's phone number"
            required
          />
        </div>
        <button type="submit" onClick={onSubmit} className="btn btn-primary">Find</button>
      </form>
      {resCards}
    </main>
  )
}