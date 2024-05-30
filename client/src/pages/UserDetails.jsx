import React, { useState, useEffect } from 'react';
import { getRequest, putRequest } from '../modules/requests/server_requests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/usersDetails.css'
const UserDetails = ({ token }) => {
  const [current_user, setCurrent_user] = useState(JSON.parse(localStorage.getItem('currentUser')));
  const [user, setUser] = useState({});
  const [email, setEmail] = useState({});
  const [alert, setAlert] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    password: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    async function getUsersDetails() {
      setAlert('');
      let dataRequest = await getRequest(`http://localhost:3000/users/${current_user.id}`, token);
      if (dataRequest.ok) {
        await setUser(dataRequest.body);
        await setEmail(dataRequest.body.email)
      }
      else {
        setAlert('בעיה בטעינת הנתונים בבקשה נסה שוב');
      }
    }
    getUsersDetails();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSave = async () => {
    setAlert('');
    let dataRequest = await putRequest(`http://localhost:3000/users/${current_user.id}`, user, token);
    if (dataRequest.ok) {
      await setUser(dataRequest.body);
      await setIsEditing(false);
      localStorage.setItem("currentUser", JSON.stringify(dataRequest.body));
    }
    else {
      setAlert('בעיה בשמירת השינויים בבקשה נסה שוב');
    }
  };

  const handleSavePassword = async () => {
    setAlert('');
    if (passwords.newPassword === passwords.confirmNewPassword) {
      const { confirmNewPassword, ...passwordData } = passwords;
      const dataRequest = await putRequest(`http://localhost:3000/passwords/${email}`, { ...passwordData, email: email }, token);
      if (!dataRequest.ok) {
        setAlert("תקלה בשמירת הססמא נסה שוב")
      }
      else {
        // alert("ישנם נתונים שגויים. נסה שוב")
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    };
  }

  return (
    <div className='usersbody'>
      {alert && <h2>בעיה בטעינת הנתונים. אנא נסה שוב</h2>}
      {isEditing ? (
        <div className='editForm_container'>
          <div className='editForm_form'>
            <label>שם: <input className='editInput' type="text" name="name" value={user.name} onChange={handleChange} /></label><br />
            <label>אמייל: <input className='editInput' type="email" name="email" value={user.email} onChange={handleChange} /></label><br />
            <label>עיר: <input className='editInput' type="text" name="city" value={user.city} onChange={handleChange} /></label><br />
            <label>רחוב: <input className='editInput' type="text" name="street" value={user.street} onChange={handleChange} /></label><br />
            <label>מספר בית: <input className='editInput' type="text" name="houseNumber" value={user.houseNumber} onChange={handleChange} /></label><br />
            <label>שם העסק: <input className='editInput' type="text" name="username" value={user.username} onChange={handleChange} /></label><br />
            <label>מספר טלפון 1: <input className='editInput' type="text" name="phone1" value={user.phone1} onChange={handleChange} /></label><br />
            <label>מספר טלפון 2: <input className='editInput' type="text" name="phone2" value={user.phone2} onChange={handleChange} /></label><br />
            <button className='editButton' onClick={handleSave}>שמירה</button>
            <button className='editButton' onClick={() => setIsEditing(false)}>ביטול</button>
          </div>
        </div>
      ) : (
        <div className='user_information'>
          <h2>פרטי משתמש</h2>
          <p><strong>שם: <FontAwesomeIcon icon="fas fa-user" /></strong> {user.name}</p>
          <p><strong>אמייל: <FontAwesomeIcon icon="fas fa-envelope" /></strong> {user.email}</p>
          <p><strong>עיר: <FontAwesomeIcon icon="fas fa-city" /></strong> {user.city}</p>
          <p><strong>רחוב: <FontAwesomeIcon icon="fas fa-road" /></strong> {user.street}</p>
          <p><strong>מספר בית: <FontAwesomeIcon icon="fas fa-house-user" /></strong> {user.houseNumber}</p>
          <p><strong>שם העסק: <FontAwesomeIcon icon="fas fa-user-tie" /></strong> {user.username}</p>
          <p><strong>מספר טלפון 1: <FontAwesomeIcon icon="fas fa-phone" /></strong> {user.phone1}</p>
          <p><strong>מספר טלפון 2: <FontAwesomeIcon icon="fas fa-phone" /></strong> {user.phone2}</p>
          <button className='editButton' onClick={() => setIsEditing(true)}>עריכה</button>
        </div>
      )}
      <div className='changePassword'>
        <h3>שנה סיסמא</h3>
        <label>סיסמא נוכחית: <input className='passwordInput' type="password" name="password" value={passwords.password} onChange={handlePasswordChange} /></label><br />
        <label>סיסמא חדשה: <input className='passwordInput' type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} /></label><br />
        <label>חזור על הסיסמא החדשה: <input className='passwordInput' type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handlePasswordChange} /></label><br />
        <button onClick={handleSavePassword}>שמור סיסמא</button>
      </div>
    </div>
  );
};


export default UserDetails;