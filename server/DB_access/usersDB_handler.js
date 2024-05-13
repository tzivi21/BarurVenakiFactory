const mysql = require('mysql');
require('dotenv').config();
const Connect = require('./ConnectDB');

async function createUser(userData) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        let sql = 'INSERT INTO Users SET ?';
        connection.query(sql, userData, async (err, result) => {
            connection.end();
            if (err) {
                reject(new Error('Error inserting new user:' + err));
            } else {
                newUser = await getUserById(result.insertId);
                resolve(newUser);
            }
        });
    });
}

async function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = `DELETE FROM Users WHERE id = ?`;
        connection.query(sql, [id], (err, result) => {
            connection.end();
            if (err) {
                reject(new Error(`Error deleting user with id:${id}` + err));
            } else {
                resolve();
            }
        });
    });
}

async function updateUser(updatedUserData) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = 'UPDATE Users SET ? WHERE id = ?';
        connection.query(sql, [updatedUserData, updatedUserData.id], async (err, result) => {
            connection.end();
            if (err) {
                reject(new Error('Error updating user:' + err));
            } else {
                let updatedUser = await getUserById(updatedUserData.id);
                resolve(updatedUser);
            }
        });
    });
}

async function getAllUsers() {
     return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = 'SELECT * FROM Users';
        connection.query(sql, (err, result) => {
            connection.end();
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function getUserById(id) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = `SELECT * FROM Users WHERE id = ?`;
        connection.query(sql, [id], (err, result) => {
            connection.end();
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
    
}

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = `SELECT * FROM Users WHERE email = ?`;
        connection.query(sql, [email], (err, result) => {
            connection.end();
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    });
}

async function getUserOrdersDetails(userId) {
    const connection = Connect();
    const query = `
        SELECT 
            o.id AS order_id,
            o.date AS order_date,
            o.status AS order_status,
            o.remarks AS order_remarks,
            p.id AS product_id,
            p.name AS product_name,
            p.weight AS product_weight,
            p.package AS product_package,
            p.imgUrl AS product_imgUrl,
            po.amount AS product_amount
        FROM 
            Orders o
        JOIN 
            ProductOrder po ON o.id = po.orderId
        JOIN 
            Products p ON po.productId = p.id
        WHERE 
            o.userId = ?
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, [userId], async (err, results) => {
            if (err) {
                connection.end();
                reject(new Error('Error fetching user orders details:' + err));
            } else {
                connection.end();
                resolve(results);
            }
        });
    });
}

  

module.exports = {
   createUser,
   getAllUsers,
   getUserById,
   deleteUser,
   updateUser,
   getUserOrdersDetails,
   getUserByEmail
};