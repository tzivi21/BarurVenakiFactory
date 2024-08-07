const mysql = require('mysql');
require('dotenv').config();
const Connect = require('./ConnectDB');

async function createOrder(orderData) {
    return new Promise(async (resolve, reject) => {
        const connection = await Connect();
        try {
            let sql = 'INSERT INTO Orders SET ?';
            const orderResult = await query(connection, sql, {
                userId: orderData.userId,
                date: orderData.date,
                status: orderData.status,
                remarks: orderData.remarks,
                deliveryDate: orderData.deliveryDate,
                totalPrice: orderData.totalPrice
            });

            for (const product of orderData.products) {
                sql = 'INSERT INTO ProductOrder SET ?';
                const productOrderData = {
                    orderId: orderResult.insertId,
                    productId: product.productId,
                    amount: product.amount
                };
                await query(connection, sql, productOrderData);
            }

            await connection.commit();
            const newOrder = await getOrderById(orderResult.insertId);
            resolve(newOrder);
        } catch (error) {
            await connection.rollback();
            reject(new Error('Error inserting new order:' + error));
        } finally {
            connection.end();
        }
    });
}

async function deleteOrder(id) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = `DELETE FROM orders WHERE id = ?`;
        connection.query(sql, [id], (err, result) => {
            connection.end();
            if (err) {
                reject(new Error(`Error deleting order with id:${id}` + err));
            } else {
                resolve();
            }
        });
    });
}

async function updateOrder(updatedOrderData) {
    return new Promise((resolve, reject) => {
        const connection = Connect();
        const sql = 'UPDATE orders SET ? WHERE id = ?';
        connection.query(sql, [updatedOrderData, updatedOrderData.id], async (err, result) => {
            connection.end();
            if (err) {
                reject(new Error('Error updating order:' + err));
            } else {
                let updatedOrder = await getOrderById(updatedOrderData.id);
                resolve(updatedOrder);
            }
        });
    });
}

async function getAllOrders() {
    return new Promise(async (resolve, reject) => {
        const connection = await Connect();

        try {
            let sql = `
                SELECT 
                    O.id AS orderId, 
                    O.userId, 
                    O.date, 
                    O.status, 
                    O.remarks, 
                    O.deliveryDate, 
                    O.totalPrice,  
                    U.username,   
                    U.city,       
                    P.productId, 
                    P.amount, 
                    E.id AS eventId, 
                    E.text AS eventText, 
                    E.date AS eventDate
                FROM 
                    Orders O
                LEFT JOIN 
                    ProductOrder P ON O.id = P.orderId
                LEFT JOIN 
                    Events E ON O.id = E.orderId
                LEFT JOIN 
                    Users U ON O.userId = U.id  -- Join with Users table
                ORDER BY O.date DESC
            `;
            const orderDetails = await query(connection, sql);

            const groupedOrders = groupByOrderId(orderDetails);
            const sortedOrders = groupedOrders.sort((a, b) => {
                return new Date(b.orderInfo.date) - new Date(a.orderInfo.date);
            })

            resolve(sortedOrders);
        } catch (error) {
            reject(new Error('Error fetching all orders details: ' + error));
        } finally {
            connection.end();
        }
    });
}



async function getOrdersByPage(offset, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            const orderDetails = await getAllOrders();
            const paginatedOrders = orderDetails.slice(offset, offset + limit);
            resolve(paginatedOrders);
        } catch (error) {
            reject(new Error('Error fetching paginated orders: ' + error));
        }
    });
}


async function getOrderById(orderId) {
    return new Promise(async (resolve, reject) => {
        const connection = await Connect();

        try {
            let sql = `
                SELECT 
                    O.id AS orderId, 
                    O.userId, 
                    O.date, 
                    O.status, 
                    O.remarks, 
                    O.deliveryDate,
                    O.totalPrice,  
                    U.username,    
                    U.city,       
                    P.id AS productId, 
                    P.name, 
                    P.weight, 
                    P.package, 
                    P.imgUrl, 
                    P.inventory, 
                    P.price,
                    PO.amount,  -- Include the amount field from ProductOrder
                    E.id AS eventId, 
                    E.text AS eventText, 
                    E.date AS eventDate
                FROM Orders O
                LEFT JOIN ProductOrder PO ON O.id = PO.orderId
                LEFT JOIN Products P ON PO.productId = P.id
                LEFT JOIN Events E ON O.id = E.orderId
                LEFT JOIN Users U ON O.userId = U.id  -- Join with Users table
                WHERE O.id = ?
            `;
            const orderDetails = await query(connection, sql, [orderId]);

            const groupedOrderDetails = groupByOrderId(orderDetails);

            if (groupedOrderDetails.length === 0) {
                resolve(null);
            } else {
                resolve(groupedOrderDetails[0]);
            }
        } catch (error) {
            reject(new Error('Error fetching order details: ' + error));
        } finally {
            connection.end();
        }
    });
}

function groupByOrderId(orderDetails) {
    const grouped = {};

    orderDetails.forEach(row => {
        if (!grouped[row.orderId]) {
            grouped[row.orderId] = {
                orderInfo: {
                    orderId: row.orderId,
                    userId: row.userId,
                    date: row.date,
                    status: row.status,
                    remarks: row.remarks,
                    deliveryDate: row.deliveryDate,
                    totalPrice: row.totalPrice,
                    username: row.username,
                    city: row.city
                },
                products: [],
                events: []
            };
        }

        if (row.productId) {
            const existingProductIndex = grouped[row.orderId].products.findIndex(product => product.productId === row.productId);
            if (existingProductIndex === -1) {
                grouped[row.orderId].products.push({
                    productId: row.productId,
                    amount: row.amount,
                    name: row.name,
                    weight: row.weight,
                    package: row.package,
                    imgUrl: row.imgUrl,
                    inventory: row.inventory,
                    price: row.price
                });
            }
        }

        if (row.eventId) {
            const existingEvent = grouped[row.orderId].events.find(event => event.eventId === row.eventId);
            if (!existingEvent) {
                grouped[row.orderId].events.push({
                    eventId: row.eventId,
                    text: row.eventText,
                    date: row.eventDate
                });
            }
        }
    });

    return Object.values(grouped);
}



function query(connection, sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    deleteOrder,
    updateOrder,
    getOrdersByPage
};
