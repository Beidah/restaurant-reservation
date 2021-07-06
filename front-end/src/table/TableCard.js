import React from "react";
import { finishTable } from "../utils/api";

function TableCard({ table, setError }) {
  const status = !table.reservation_id ? "Free" : "Occupied";

  const onFinish = () => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      finishTable(table.table_id)
        .then(() => window.location.reload())
        .catch(setError);
    }
  }

  return (
    <div className="card table-card pl-2 pr-2 col-3 m-3" style={{minWidth: "20%"}} >
      <div className="card-header">
          <h5 className="card-title">{table.table_name}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">Capacity: {table.capacity}</p>
        <p className="card-text">
          Status: <span data-table-id-status={table.table_id}>{status}</span> 
          {table.reservation_id &&
            <button className="btn btn-danger float-right" data-table-id-finish={table.table_id} onClick={onFinish}>
              Finish
            </button>
          }
        </p>
      </div>
    </div>
  )
}

export default TableCard;