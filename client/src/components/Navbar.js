import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import "./navbar.css"
import menuicon from '../menu2.png'
import logo from '../whosinlogo.png'

const Navbar = () =>{
    const [showDropdown, setDropDown] = useState(0)

    const toggleDropdown = () =>{
        if (showDropdown == 0){
            setDropDown(1)
        }else{
            setDropDown(0)
        }
    }
    const dropDown = () =>{
        if (showDropdown==1){
            return (
                <div className="drop-down-menu-cntr">
                    <Link to="/createevent" onClick={toggleDropdown}>Create Event</Link>
                </div>
            )
        }else{
            return(
                <div></div>
            )
        }
    }

    return(
        <div className="navbar-container">
            <img className ="navbar-logo" src={logo}/>
            <img className = "drop-down-button" src={menuicon} onClick={toggleDropdown}/>
            <div className = "drop-down-cntr">{dropDown()}</div>
        </div>
    )
}

export default Navbar;