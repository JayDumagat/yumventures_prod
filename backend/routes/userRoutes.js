const express = require('express');

const router = express.Router();    

const { getAllUserByRole, createUser} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getAllUserByRole);
router.post('/', authMiddleware, createUser);


module.exports = router;