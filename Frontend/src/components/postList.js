import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostList() {
    return (
        <body>
            <div className="container">
                <h3 className="header">APDS notice Board</h3>
                <table className="table table-striped" style={{ marginTop:20 }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Caption</th>
                            <th>Image</th>
                            <th>Actions</th> {/* added column for actions */}
                        </tr>
                    </thead>
                </table>
            </div>
        </body>
    );
}