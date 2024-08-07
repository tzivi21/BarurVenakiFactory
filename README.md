Barur VeNaki Factory Website

The "Barur VeNaki" factory website is designed for a vacuum-packed legumes packaging company. The site is developed with three user modes    :

guest-products page
![image](https://github.com/tzivi21/BarurVenakiFactory/assets/148487391/6fc522a9-3343-4f8e-b163-04abe4c84970)
user- order page
![image](https://github.com/tzivi21/BarurVenakiFactory/assets/148487391/4a776ff0-6db9-4306-81c5-18683997e6d0)
manager- users page
![image](https://github.com/tzivi21/BarurVenakiFactory/assets/148487391/2dcf0b62-6ae0-4f1d-aa28-da136cabe03e)



Guest: View products.

Customer: View products, place orders, view previous orders, and check order status.

manager: Update orders, send emails to customers, add, delete, and update products.

The website is built using a layered architecture and utilizes the following technologies:


Database: MySQL

Frontend: HTML, React,redux

Backend: Node.js, JavaScript

Project Structure

The project follows a layered architecture pattern to separate concerns and ensure scalability and maintainability.
The server-side is organized into the following layers:

Database Layer: Manages all database operations using MySQL.

Routes Layer: Defines the API endpoints and routes.

Controllers Layer: Handles the logic for each API endpoint, interacting with the services layer.

Services Layer: Contains business logic and interacts with the database layer.


Security Implementations

Security measures have been integrated to ensure the safety and integrity of the data. These include:

Authentication and authorization to control access to different parts of the application.

Data validation and sanitization to prevent SQL injection and other common vulnerabilities.

Secure communication protocols for data transmission.

Technologies Used

Database: MySQL for storing product information, user details, orders, etc.

Frontend: HTML and React for building a dynamic and responsive user interface.

Backend: Node.js and JavaScript for server-side logic and API endpoints.
User Modes

Guest
Can browse and view products available in the store.
Customer

Can view products and place new orders.
Can view previous orders and check the status of current orders.
manager

Can update order statuses and manage customer interactions.
Can add, delete, and update product details.
Has the ability to send emails to customers for notifications and updates.

Contributors

Tzivi Shacar https://github.com/tzivi21

Tsipi Wajsberg  https://github.com/tsw1212
