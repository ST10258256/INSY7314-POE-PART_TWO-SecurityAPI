import React from "react";
import { Link } from "react-router-dom";

export default function PostList() {
  return (
    <div>
      <h2>Posts (placeholder)</h2>
      <p>This is a placeholder list. Create posts to see them here.</p>
      <Link className="btn btn-primary" to="/create">Create new post</Link>
    </div>
  );
}
