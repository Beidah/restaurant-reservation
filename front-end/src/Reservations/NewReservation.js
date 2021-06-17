import React, { useState } from "react";
import { Form, Col, Button, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function Reservations() {
  const defaultFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);
  const history = useHistory();

  const onChange = ({ target }) => {
    if (target.name === "people") {
      target.value = Number(target.value);
    }
    setFormData({
      ...formData,
      [target.name]: target.value
    });

  }

  const onSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    const data = formData;
    data.people = Number(data.people);
    
    createReservation(data, abortController.signal)
      .then(response => {
        if (response.ok) {
          history.push(`/dashboard?date=${formData.reservation_date}`);
        } else {
          console.error(response.body);
          setError(response.body.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });

    return () => abortController.abort();
  }

  const onCancel = () => {
    history.goBack();
  }

  return (
    <>
      <ErrorAlert error={error} />
      <Form onSubmit={onSubmit}>
        <Form.Row>
          <Form.Group as={Col} controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control name="first_name" onChange={onChange} value={formData.first_name} required />
          </Form.Group>

          <Form.Group as={Col} controlId="formFirstName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="last_name" onChange={onChange} value={formData.last_name} required />
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="formMobileNumber">
          <Form.Label>Mobile Number</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">+1</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control 
              name="mobile_number"
              type="tel"
              placeholder="555-555-5555"
              pattern="\d{3}-\d{3}-\d{4}"
              onChange={onChange} 
              value={formData.mobile_number} 
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formPeople">
          <Form.Label>People</Form.Label>
          <Form.Control
            name="people"
            type="number"
            min="1"
            onChange={onChange}
            value={formData.people}
            required
          />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="formReservationDate">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              name="reservation_date" 
              type="date" 
              placeholder="YYYY-MM-DD" 
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={onChange} value={formData.reservation_date} 
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formReservationTime">
            <Form.Label>Time</Form.Label>
            <Form.Control 
              name="reservation_time" 
              type="time" 
              placeholder="HH:MM" 
              pattern="\[0-9]{2}-[0-9]{2}"
              onChange={onChange} 
              value={formData.reservation_time} 
              required
            />
          </Form.Group>
        </Form.Row>

        <Button type="submit" className="mr-2">Submit</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </Form>
    </>
  )
}

export default Reservations;