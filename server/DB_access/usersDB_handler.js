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

function getAllUsers() {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = 'SELECT * FROM Users';

        connection.query(sql, async (err, users) => {
            if (err) {
                connection.end();
                return reject(err);
            }

            try {
                const usersWithManagerStatus = await Promise.all(users.map(user => {
                    return new Promise((resolve, reject) => {
                        const managerSql = 'SELECT COUNT(*) AS isManager FROM Managers WHERE id = ?';
                        connection.query(managerSql, [user.id], (err, result) => {
                            if (err) {
                                return reject(err);
                            }

                            user.manager = result[0].isManager ? 1 : 0;
                            resolve(user);
                        });
                    });
                }));

                connection.end();
                resolve(usersWithManagerStatus);
            } catch (err) {
                connection.end();
                reject(err);
            }
        });
    });
}

async function getUsersPaged(offset, limit) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = `SELECT * FROM Users LIMIT ?, ?`;
        connection.query(sql, [offset, limit], async (err, result) => {
            if (err) {
                connection.end();
                reject(err);
                return;
            }

            try {
                const users = result;

                const usersWithManagerStatus = await Promise.all(users.map(user => {
                    return new Promise((resolve, reject) => {
                        const managerSql = 'SELECT COUNT(*) AS isManager FROM Managers WHERE id = ?';
                        connection.query(managerSql, [user.id], (err, result) => {
                            if (err) {
                                return reject(err);
                            }

                            user.manager = result[0].isManager ? 1 : 0;
                            resolve(user);
                        });
                    });
                }));


                connection.end();
                resolve(usersWithManagerStatus);
            } catch (error) {
                connection.end();
                reject(error);
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
            O.id AS orderId, 
            O.userId, 
            O.date, 
            O.status, 
            O.remarks, 
            O.deliveryDate,
            O.totalPrice  -- Include totalPrice
        FROM Orders O
        WHERE O.userId = ?
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
    getUserByEmail,
    getUsersPaged
};