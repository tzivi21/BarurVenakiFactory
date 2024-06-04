import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../modules/FontAwesome';
import '../../css/header.css'
import { NavLink } from 'react-router-dom';
function ManagerHeader({ logOut }) {
  return (

    <header>
      <nav className='nav'>
        <div className='leftSide'>
          <NavLink className='navLinkHeader' to="userDetails"><FontAwesomeIcon className='icon' icon="fas fa-user-alt" /></NavLink>
          <NavLink className='navLinkHeader' to="allOrders">הזמנות</NavLink>
          <NavLink className='navLinkHeader' to="products">מוצרים</NavLink>
          <NavLink className='navLinkHeader' to="users">משתמשים</NavLink>
          <NavLink className='navLinkHeader' to="." onClick={() => logOut()}><FontAwesomeIcon className='icon' icon="fas fa-sign-out-alt" /></NavLink >
        </div>
        <NavLink to="."> <img className='logoImg' src='../../../images/logo.png' alt='logo' />

        </NavLink>
      </nav>
    </header>

  )
}

export default ManagerHeader
