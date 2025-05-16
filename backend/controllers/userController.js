const {findAllStaff,insertUser} = require('../services/userService');
const getAllUserByRole = async (req, res) => {
    try {
        const users = await findAllStaff();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }   
}

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, role } = req.body;
        const user = await insertUser(firstName, lastName, email, username, password, role);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



module.exports = {
    getAllUserByRole,
    createUser,
   
};