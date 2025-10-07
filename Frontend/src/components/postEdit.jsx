import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  function handleSave(e) {
    e.preventDefault();
    alert("Post saved (placeholder)");
    navigate("/");
  }
  return (
    <div>
      <h2>Edit Post (placeholder) — ID: {id}</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" defaultValue={`Post ${id}`} />
        </div>
        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea className="form-control" rows="4">Post body</textarea>
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}
