import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, seatTable } from "../utils/api";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [tableId, setTableId] = useState(undefined);

  useEffect(() => {
    const abortController = new AbortController();

    listTables(abortController.signal)
      .then((res) => {
        setTables(res);
        setTableId(res[0].table_id);
      })
      .catch(setTablesError);

    return () => abortController.abort();
  }, []);

  const onChange = (event) => {
    const id = Number(event.target.value);
    setTableId(id);
  }

  const onSubmit = (event) => {
    event.preventDefault();

    if (tableId === undefined) {
      setTablesError({ message: "Table must be selected" });
      return;
    }

    seatTable(reservation_id, tableId)
      .then(() => history.push("/dashboard"))
      .catch(setTablesError);
  }

  const onCancel = () => {
    history.push(-1);
  }

  const tableSelects = tables
    .filter(table => table.free)
    .map((table, key) => {
      return (
        <option value={table.table_id} key={key}>{table.table_name} - {table.capacity}</option>
      )
    });

  return (
    <main>
    <ErrorAlert error={tablesError} />
    <form>
      <div className="form-group">
        <label htmlFor="tableSelect">Select Table</label>
        <select className="form-control" name="table_id" onChange={onChange} value={tableId} required>
          {tableSelects}
        </select>
      </div>
      <button type="submit" onClick={onSubmit} className="btn btn-primary mr-2">Seat</button>
      <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
    </form>
    </main>
  )
}

export default SeatReservation;