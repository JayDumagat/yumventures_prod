const {User, sequelize, RandomCode} = require('../models');
const { generateSixDigitCode } = require('../utils/GenerateRandomCode');


const login = async (username, password) => {
  const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne({ where: { username }, transaction });
      if (!user) {
        throw new Error('Invalid username');
      }

      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
}

const register = async (firstName, lastName, email, username, password, role) => {
  const transaction = await sequelize.transaction();

    try {
        const existingUser = await User.findOne({ where: { username }, transaction });
        if (existingUser) {
        throw new Error('Username already exists');
        }
    
        const existingEmail = await User.findOne({ where: { email }, transaction });
        if (existingEmail) {
        throw new Error('Email already exists');
        }

        const newUser = await User.create({ firstName, lastName, email, username, password, role }, { transaction });
        await transaction.commit();
        return newUser;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const findUserByEmail = async (email) => {
  const transaction = await sequelize.transaction();

    try {
        const user = await User.findOne({ where: { email }, transaction });
        if (!user) {
            throw new Error('User not found');
        }

        await transaction.commit();
        return user;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const requestEmailCode = async (email) => {
  const transaction = await sequelize.transaction();

    try {
        const code = generateSixDigitCode();

        await transaction.commit();
        return code;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const changeUserPassword = async (userId, newPassword) => { 
  const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        user.password = newPassword;
        await user.save({ transaction });
        await transaction.commit();
        return user;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


const saveVerificationCode = async (id, code, validUntil) => {
  const transaction = await sequelize.transaction();

  try {
    // Check for existing code for this user
    const existingCode = await RandomCode.findOne({ where: { userId: id }, transaction });
    if (existingCode) {
      await existingCode.destroy({ transaction });
    }

    // Create new code
    const newCode = await RandomCode.create({ userId: id, code, validUntil }, { transaction });
    await transaction.commit();
    return newCode;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

const isVerificationCodeValid = async (code) => {
  const transaction = await sequelize.transaction();

  try {
    const verificationCode = await RandomCode.findOne({ where: { code }, transaction });
    if (!verificationCode) {
      throw new Error('Invalid verification code');
    }

    const currentTime = new Date();
    if (currentTime > verificationCode.validUntil) {
      throw new Error('Verification code expired');
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}


module.exports = {
  login,
  register,
  changeUserPassword,
  findUserByEmail,
  requestEmailCode,
  saveVerificationCode,
  isVerificationCodeValid
};