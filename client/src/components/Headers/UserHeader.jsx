import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../modules/FontAwesome';
import { NavLink } from 'react-router-dom';
import '../../css/header.css';
import NumbersOfItem from './NumbersOfItem';
import { getRequest } from '../../modules/requests/server_requests';
import { useSelector } from 'react-redux';


function UserHeader({ logOut, countCartItems, setCountCartItems }) {
    const token = useSelector(state => state.app.token);
    useEffect(() => {
        async function fetchData() {
            const user = JSON.parse(localStorage.getItem("currentUser"));
            const reqData = await getRequest(`http://localhost:3000/cart/${user.id}`, token);
            if (reqData.ok) {
                const uniqueItems = new Set(reqData.body.map(item => `${item.name}-${item.package}`));
                setCountCartItems(uniqueItems.size);
            }
        }
        fetchData();
    }, [countCartItems, token]);

    return (
        <header>
            <nav className='nav'>
                <div className='leftSide'>
                    <NavLink className='navLinkHeader' to="userDetails">
                        <FontAwesomeIcon className='Headericon firstIcon' icon="fas fa-user-alt" />
                    </NavLink>
                    <NavLink className='navLinkHeader' to="shopping_cart">
                        <div className="cartContainer">
                            <FontAwesomeIcon className='Headericon' icon="fas fa-shopping-cart" />
                            <NumbersOfItem countCartItems={countCartItems} />
                        </div>
                    </NavLink>
                    <NavLink className='navLinkHeader' to="contactUs">צור קשר</NavLink>
                    <NavLink className='navLinkHeader' to="orders">הזמנות קודמות</NavLink>
                    <NavLink className='navLinkHeader' to="products">מוצרים</NavLink>
                    <NavLink className='navLinkHeader' to="." onClick={() => logOut()}>
                        <FontAwesomeIcon className='Headericon' icon="fas fa-sign-out-alt" />
                    </NavLink>
                </div>
                <NavLink to=".">
                    <img className='logoImg' src='../../../images/logo.png' alt='logo' />
                </NavLink>
            </nav>
        </header>
    );
}

export default UserHeader;
