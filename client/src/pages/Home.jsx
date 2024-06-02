import React from 'react';
import { useState, useEffect } from 'react';
import '../css/home.css';
import WorngRequest from '../pages/WorngRequest';
import { getRequest } from '../modules/requests/server_requests';

function Home({ status, token, setToken }) {
  const [worngRequest, setWorngRequest] = useState(false);

  useEffect(() => {
    async function fatchData() {
      let updateToken;
      if (token == "") {
        updateToken = localStorage.getItem("token");
        if (!updateToken) {
          let dataRequest = await getRequest(`http://localhost:3000/guest_token`);
          if (dataRequest.ok) {
            localStorage.setItem('token', dataRequest.token);
            await setToken(dataRequest.token);
          }
        }
        else {
          await setToken(updateToken);
        }
      }
    }
    fatchData();
  }, []);

  return (
    <div>
      <div className="hero">
        <div >
          <h2 className="section-title">אודותינו</h2>
          <p className="section-content">
            ברור ונקי-המקום בו איכות פוגשת נוחות
          </p>
        </div>
      </div>

      <section className="">
        <h2 className="section-title">המוצרים שלנו</h2>
        <div className="container">
          <div className="leftSideTxt">
            <p className="section-content">
              המגוון שלנו כולל סוגים שונים של קטניות ואורז, אשר כולם מגיעים מהחוות הטובות ביותר ועוברים תהליך קפדני של ניקוי, מיון ואריזת ואקום כדי לשמור על הערכים התזונתיים ולהאריך את חיי המדף.
            </p>
          </div>
          <img className='imgAboutuSRight' src='../../images/home1.png' alt="תמונה של הסיפור שלנו" />
        </div>
      </section>

      <section className="">
        <h2 className="section-title">טכנולוגיה מתקדמת</h2>
        <div className="container">
          <div className="rightSideTxt">
            <p className="section-content">
              אנו משתמשים בטכנולוגיות המתקדמות ביותר כדי להבטיח שמוצרינו יהיו באיכות הגבוהה ביותר. מכונות האריזה המתקדמות שלנו יוצרות אטימה הרמטית המגינה מפני לחות, אוויר ומזיקים, ומבטיחות שתקבלו את המוצר הטרי ביותר.
            </p>
          </div>
          <img className='imgAboutuSLeft' src="path/to/image2.jpg" alt="תמונה של ערכינו" />
        </div>
      </section>

      <section className="">
        <h2 className="section-title">בקרת איכות</h2>
        <div className="container">
          <div className="leftSideTxt">
            <p className="section-content">
              האיכות היא במרכז כל מה שאנחנו עושים. תהליכי בקרת האיכות המחמירים שלנו מבטיחים שכל חבילה שיוצאת מהמפעל עומדת בסטנדרטים הגבוהים ביותר של בטיחות ומצוינות. אנו מחויבים לספק מוצרים לא רק טעימים אלא גם בריאים ובטוחים למשפחתכם.
            </p>
          </div>
          <img className='imgAboutuSRight' src="client\images\home1.png" alt="תמונה של הצוות" />
        </div>
      </section>
      <section >
        <h2 className="section-title"> ? למה לבחור בנו</h2>
        <div className="container">
          <div className="lastDivManyItems">
            <div className="section-item1">
              <h2>בריאות ובטיחות</h2>   
              אנו מקפידים על הסטנדרטים הגבוהים ביותר של בקרת איכות כדי להבטיח שכל חבילה בטוחה ומזינה           </div>
            <div className="section-item2">
              <h2>טכנולוגיה מתקדמת</h2>
               הטכנולוגיה המתקדמת שלנו לאריזת ואקום מבטיחה איכות לאורך זמן והגנה מפני מזיקים</div>
            <div className="section-item3">
              <h2>נוחות</h2>
               עם מערכת ההזמנות המקוונת שלנו, תוכלו
               להירשם במהירות ולהתחיל לבצע הזמנות בקלות</div>
            <div className="section-item4">
              <h2>כשרות</h2>
              <img style={{width:"75%"}} src="https://www.hamichlol.org.il/w/upload/michlol/b/b7/HCharedit.svg" alt='לוגו כשרות בד"ץ העדה החרדית'></img>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
