import React, { useState } from 'react';
import { postRequest } from '../../modules/requests/server_requests';
import '../../css/usersManagersForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';


const UserManagerForm = ({ setNewMangerOn, setFilteredUsers }) => {
    const token = useSelector((state) => state.app.token);

    const [userId, setUserId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const requestData = await postRequest('http://localhost:3000/managers', { id: userId }, token);
            if (requestData.ok) {
                alert('מנהל נוסף בהצלחה');
                await setFilteredUsers(prevUsers => prevUsers.map(user => {
                    if (user.id === userId) {
                        return { ...user, manager: 1 };
                    }
                    return user;
                }));
            } else {
                alert('תקלה בקביעת משתמש בתור מנהל בבקשה נסה שוב');
            }
            setUserId('');
            setNewMangerOn(false);
        } catch (error) {
            alert('תקלה בקביעת משתמש בתור מנהל בבקשה נסה שוב');
        }
    };

    return (
        <>
            <div className='createManager_container'>
                <FontAwesomeIcon className='exit' icon="fas fa-times" onClick={() => setNewMangerOn(false)} />
                <form onSubmit={handleSubmit} className='createManager_form'>
                    <div>
                        <label>
                            קבע משתמש כמנהל
                            <input
                                type="number"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder='ID של המשתמש'
                                required
                                className='add_manager_input'
                            />
                        </label>
                    </div>
                    <button type="submit">קבע כמנהל</button>
                </form>
            </div>
            <div className='overlay' onClick={() => setNewMangerOn(false)} />
        </>
    );
};

export default UserManagerForm;
