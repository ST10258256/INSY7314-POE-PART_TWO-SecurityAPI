import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function hasValidToken() {
  const t = localStorage.getItem("bank_token");
  // consider empty/"null"/"undefined" as no-token
  return Boolean(t && t !== "null" && t !== "undefined");
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasValidToken());

  useEffect(() => {
    // update state once on mount (in case value changed before mount)
    setIsLoggedIn(hasValidToken());

    // handler for storage events (other tabs)
    function handleStorage() {
      setIsLoggedIn(hasValidToken());
    }
    window.addEventListener("storage", handleStorage);

    // lightweight poll to catch same-tab changes where storage event doesn't fire
    const interval = setInterval(() => {
      setIsLoggedIn(prev => {
        const now = hasValidToken();
        return prev === now ? prev : now;
      });
    }, 400); // 400ms - responsive but not heavy

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          The Group 14 Bank
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/pay">
                    Make Payment
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
