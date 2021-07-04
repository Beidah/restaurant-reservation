import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function NewTable() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: 0
  });
  const [error, setError] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();

    createTable(formData)
      .then(() => history.push("/dashboard"))
      .catch(setError);
  }

  const onCancel = () => {
    history.goBack();
  }

  const onChange = (event) => {
    const target = event.target;
    const value = target.type === "number" ? Number(target.value) : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });

  }

  return (
    <form onSubmit={onSubmit}>
      <ErrorAlert error={error} />
      <div className="form-group">
        <label className="form-label" htmlFor="tableName">Table Name</label>
        <input 
          id="tableName" 
          name="table_name" 
          className="form-control" 
          required minLength="2"
          onChange={onChange}
          value={formData.table_name}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="tableCapacity">Capacity</label>
        <input 
          type="number" 
          id="tableCapacity" 
          name="capacity" 
          className="form-control" 
          required min="1"
          onChange={onChange}
          value={formData.capacity}
        />
      </div>
      <button type="submit" className="btn btn-primary mr-3">Submit</button>
      <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
    </form>
  );
}

export default NewTable;