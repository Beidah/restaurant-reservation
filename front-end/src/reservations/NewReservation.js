import React, { useState } from "react";
import { Form, Col, Button, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function Reservations() {

  return (
    <main>
      <h1>New Reservation</h1>
      <ReservationForm />
    </main>
  )
}

export default Reservations;