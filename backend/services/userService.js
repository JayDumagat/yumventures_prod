
const { User, sequelize } = require('../models');

const findAllStaff = async () => {
  try {
    const staff = await User.findAll({
      where: {
        role: 'cashier',
      },
      attributes: { exclude: ['password'] },  
      order: [['createdAt', 'DESC']],
    });
    return staff;
  } catch (error) {
    throw error;
  }
};

const insertUser = async (firstName, lastName, email, username, password, role) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        username,
        password,
        role,
      },
      { transaction }
    );

    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};



module.exports = {
  findAllStaff,
  insertUser,
 
};
