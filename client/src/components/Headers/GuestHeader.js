import React from 'react'
import t from '../../../images/logo.png'
function GuestHeader() {
    return (
        <div>
            <img src='../../../images/logo.png' alt='logo' />
            <NavLink to="/login">כניסה</NavLink>
            <NavLink to="/signup">הרשמה</NavLink>
        </div>
    )
}

export default GuestHeader
