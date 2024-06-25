import React from 'react'
import '../../css/header.css'
import { NavLink } from 'react-router-dom'
function GuestHeader() {
    return (
        <div className='nav'>
            <div className='leftSide'>
                <NavLink className='navLinkHeader' to="/login">כניסה</NavLink>
                <NavLink className='navLinkHeader' to="/signup">הרשמה</NavLink>
                <NavLink className='navLinkHeader' to="/home/products">מוצרים</NavLink>
            </div>
            <NavLink  to="."><img  className='logoImg'  src='../../../images/logo.png' alt='logo' /></NavLink>
        </div>
    )
}

export default GuestHeader
