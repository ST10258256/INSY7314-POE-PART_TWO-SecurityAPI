import React from "react";
import { Link } from "react-router-dom";

export default function PostCreate() {
  return (
    <div className="container">
      <h3 className="header">APDS notice Board</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Caption</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row */}
          <tr>
            <td>John Doe</td>
            <td>Sample caption</td>
            <td>Image URL</td>
            <td>
              <Link to="/edit/1" className="btn btn-sm btn-primary">
                Edit
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
