import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostCreate() {
  const navigate = useNavigate();
  function handleCreate(e) {
    e.preventDefault();
    // placeholder: in real app call backend
    alert("Post created (placeholder)");
    navigate("/");
  }
  return (
    <div>
      <h2>Create Post (placeholder)</h2>
      <form onSubmit={handleCreate}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Body</label>
          <textarea className="form-control" rows="4" />
        </div>
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  );
}
