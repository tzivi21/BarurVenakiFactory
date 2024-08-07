const bcrypt = require('bcrypt');
const connect = require('./ConnectDB');

async function insertIntoUsers() {
    const connection = connect();
    const sql = 'INSERT INTO Users (name, email, city, street, houseNumber, username, phone1, phone2) VALUES ?';
    const values = [
        ['tzivi', 'tzivish2141@gmail.com', 'New York', '5th Avenue', '101', 'johndoe', '1234567890', '0987654321'],
        ['Jane Smith', 'jane.smith@example.com', 'Los Angeles', 'Sunset Blvd', '202', 'janesmith', '2345678901', '']
    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted users successfully");
        connection.end();
    });
}

async function insertIntoOrders() {
    const connection = connect();
    const sql = 'INSERT INTO Orders (userId, date, status, remarks, totalPrice) VALUES ?';
    const values = [
        [1, new Date(), 'Pending', 'First order', 100.50],
        [2, new Date(), 'Shipped', 'Second order', 150.75],
        [1, new Date(), 'Shipped', 'Second order', 200.00]
    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted orders successfully");
        connection.end();
    });
}


async function insertIntoEvents() {
    const connection = connect();
    const sql = 'INSERT INTO Events (orderId, text, date) VALUES ?';
    const values = [
        [3, 'Order received', new Date()],
        [1, 'Order shipped', new Date()],
        [2, 'Order shipped', new Date()]

    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted events successfully");
        connection.end();
    });
}

async function insertIntoProducts() {
    const connection = connect();
    const sql = 'INSERT INTO Products (name, weight, package, imgUrl, inventory, price) VALUES ?';
    const values = [
        ['Product 1', 1.00, 'Box', 'http://example.com/img1.jpg', 100, 10.2],
        ['Product 2', 2.00, 'Bag', 'http://example.com/img2.jpg', 200, 12.5]
    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted products successfully");
        connection.end();
    });
}

async function insertIntoProductOrder() {
    const connection = connect();
    const sql = 'INSERT INTO ProductOrder (orderId, productId, amount) VALUES ?';
    const values = [
        [3, 1, 2],
        [3, 5, 3],
        [1, 6, 3],
        [2, 1, 3]
    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted product orders successfully");
        connection.end();
    });
}

async function insertIntoManagers() {
    const connection = connect();
    const sql = 'INSERT INTO Managers (id) VALUES ?';
    const values = [
        [1],
        [2]
    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted managers successfully");
        connection.end();
    });
}

async function insertIntoPasswords() {
    const connection = connect();
    const sql = 'INSERT INTO Passwords (email, password) VALUES ?';

    const passwords = [
        { email: 'tzivish2141@gmail.com', password: '123' },
        { email: 'jane.smith@example.com', password: 'password456' }
    ];

    const hashedPasswords = await Promise.all(passwords.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return [user.email, hashedPassword];
    }));

    connection.query(sql, [hashedPasswords], (err, result) => {
        if (err) throw err;
        console.log("Inserted passwords successfully");
        connection.end();
    });
}

async function insertIntoCart() {
    const connection = connect();
    const sql = 'INSERT INTO Cart (userId, productId, amount, choose) VALUES ?';
    const values = [
        [1, 1, 2, true],
        [2, 2, 1, false],
        [3, 5, 4, true],
        [1, 9, 1, false],
        [1, 1, 3, true],
        [3, 6, 2, true],
        [3, 2, 1, false],
        [3, 9, 5, true]
    ];
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted cart items successfully");
        connection.end();
    });
}
const insertIntoFactory = async () => {
    const connection = connect();
    const sql = 'INSERT INTO Factory (name, phone, email, passwordEmail, street, city, houseNumber) VALUES ?';
    const values = [
        ['ברור ונקי', '0586654543', 'tzivish2141@gmail.com', 'aive hpbo jmgv myhy', 'פרחי ההר', 'א"ת הר טוב', 3],
    ];

    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Inserted factories successfully");
        connection.end();
    });
};



function insert(params) {
    // insertIntoUsers();
    //insertIntoOrders();
    // insertIntoEvents();
    // insertIntoProducts();
    // insertIntoProductOrder();
    // insertIntoManagers();
    // insertIntoPasswords();
    insertIntoCart();
    //  insertIntoFactory();
}

module.exports = {
    insert
};
