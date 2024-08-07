const DB_actions = require('../DB_access/usersDB_handler');
const passwordsDB_handler = require('../DB_access/passwordsDB_handler');
const bcrypt = require('bcrypt');


const UsersServices = {

    createUser: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const { password, ...updatedUser } = user;
        let newUser = await DB_actions.createUser(updatedUser);
        await passwordsDB_handler.createPassword({ email: user.email, password: hashedPassword });
        return newUser;
    },

    getAllUsers: async () => {
        return await DB_actions.getAllUsers();
    },

    getUsersPaged: async (offset, limit) => {
        return await DB_actions.getUsersPaged(offset, limit);;
    },

    getUserById: async (id) => {
        return await DB_actions.getUserById(id);
    },

    getUserByEmail: async (email) => {
        return await DB_actions.getUserByEmail(email);
    },

    updateUser: async (updatedUserData) => {
        return await DB_actions.updateUser(updatedUserData);
    },

    deleteUser: async (id) => {
        await DB_actions.deleteUser(id);
    },

    getUserOrdersDetails: async (id) => {
        return await DB_actions.getUserOrdersDetails(id);
    }

};

module.exports = UsersServices;

