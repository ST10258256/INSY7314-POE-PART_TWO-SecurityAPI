import React from "react";
import logo from "../logo.svg"
//we import bootstrap to make our applicaion look better
import "bootstrap/dist/css/bootstrap.css";
//we import Navlink to utilize the react router
import { NavLink } from "react-router-dom";
// Here, we display our Navbar
export default funtion NavBar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to="/">
                <img style={{"width" : 25 + '%'}} src={logo}></img>
                </NavLink>
                    <div className="navbar" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <NavLink className="nav-link" to="/">
                                List
                            </NavLink>
                            <NavLink className="nav-link" to="/create">
                                Create Post
                            </NavLink>
                            <NavLink className="nav-link" to="/register">
                                Register
                            </NavLink>
                            <NavLink className="nav-link" to="/login">
                                Login
                            </NavLink>
                        </ul>
                    </div>
            </nav>
        </div>
    );
}