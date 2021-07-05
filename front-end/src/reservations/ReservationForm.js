import React, { useEffect, useState } from "react";
import { Form, Col, Button, InputGroup } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation, getReservation } from "../utils/api";

export default function ReservationForm() {
  const { reservation_id = null } = useParams();
  const createMode = reservation_id === null ? true : false;
  const defaultFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0
  };

  const [reservation, setReservation] = useState(defaultFormData);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (!createMode) {
      const abortController = new AbortController();
      getReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setError);

      return () => abortController.abort();
    }
  }, [reservation_id, createMode]);

  const disabled = reservation.status && reservation.status !== "booked";

  const onChange = ({ target }) => {
    if (target.name === "people") {
      target.value = Number(target.value);
    }
    setReservation({
      ...reservation,
      [target.name]: target.value
    });

  }

  const onSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    const data = reservation;
    data.people = Number(data.people);

    if (createMode) {
      createReservation(data, abortController.signal)
        .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
        .catch((error) => setError(error));
    } else if (!disabled) {
      editReservation(data, abortController.signal)
        .then(() => history.push(-1))
        .catch((error) => setError(error));
    }

    return () => abortController.abort();
  }

  const onCancel = () => {
    history.goBack();
  }

  return (
    <>
    <ErrorAlert error={error} />
      <form onSubmit={onSubmit}>
        <fieldset disabled={disabled}>
        {disabled && 
          <div className="alert alert-danger" role="alert">
          Cannot edit a reservation after it has been seated or cancelled.
          </div>
        }
        <div className="row">
          <div className="col" controlId="formFirstName">
            <label htmlFor="first_name">First Name</label>
            <input className="form-control" id="first_name" name="first_name" onChange={onChange} value={reservation.first_name} required />
          </div>

          <div className="col" controlId="formFirstName">
            <label htmlFor="last_name">Last Name</label>
            <Form.Control id="last_name" name="last_name" onChange={onChange} value={reservation.last_name} required />
          </div>
        </div>

        <div className="form-group" controlId="formMobileNumber">
          <label htmlFor="mobile_number">Mobile Number</label>
          <div className="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">+1</div>
            </div>
            <input
              className="form-control" 
              name="mobile_number"
              id="mobile_number"
              type="tel"
              placeholder="555-555-5555"
              pattern="\d{3}-\d{3}-\d{4}"
              onChange={onChange} 
              value={reservation.mobile_number} 
              required
            />
          </div>
        </div>

        <div className="form-group" controlId="formPeople">
          <label htmlFor="people">People</label>
          <input
            className="form-control"
            name="people"
            id="people"
            type="number"
            min="1"
            onChange={onChange}
            value={reservation.people}
            required
          />
        </div>

        <div className="row">
          <div className="col" controlId="formReservationDate">
            <label htmlFor="reservation_date">Date</label>
            <input
              className="form-control" 
              name="reservation_date" 
              id="reservation_date" 
              type="date" 
              placeholder="YYYY-MM-DD" 
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={onChange} value={reservation.reservation_date} 
              required
            />
          </div>

          <div className="col">
            <label htmlFor="reservation_time">Time</label>
            <input
              className="form-control" 
              name="reservation_time" 
              id="reservation_time" 
              type="time" 
              placeholder="HH:MM" 
              pattern="\[0-9]{2}-[0-9]{2}"
              onChange={onChange} 
              value={reservation.reservation_time} 
              required
            />
          </div>
        </div>

        </fieldset>
        <div className="mt-3">

          <button type="submit" className="btn btn-primary mr-2">Submit</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </>
  )
}