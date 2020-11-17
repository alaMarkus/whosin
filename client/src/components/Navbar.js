import React from 'react'
import {Link} from 'react-router-dom'
import "./navbar.css"

const Navbar = () =>{
    return(
        <div className="navbar-container">
            <Link to="/createevent">Create Event</Link>
            <Link to="/signevent">sign up</Link>
        </div>
    )
}

export default Navbar;