const {User, sequelize, RandomCode} = require('../models');
const { generateSixDigitCode } = require('../utils/GenerateRandomCode');
const { uploadImage, deleteImage } = require('./minioService');


const extractFilenameFromUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // Handle different URL formats
    if (imageUrl.startsWith('/images/')) {
        return imageUrl.replace('/images/', '');
    }

    // Fallback to splitting by '/' and taking the last part
    return imageUrl.split("/").pop();
};

const login = async (username, password) => {
  const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne({ where: { username }, transaction });
      if (!user) {
        throw new Error('Invalid credentials, please try again');
      }

      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials, please try again');
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
        console.log(`Verification code for ${email}: ${code}`);

        await transaction.commit();
        return code;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const updateUser = async (userId, newPassword, fileData) => {
    const transaction = await sequelize.transaction();

    let imagePath = null;

    if (fileData) {
        const uploadedImage = await uploadImage(
            fileData.buffer,
            fileData.originalname,
            fileData.mimetype
        );
        imagePath = uploadedImage.url;
    }

    try {
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error('User not found');
        }

        // Check if newPassword is provided and is different from current password
        if (newPassword && newPassword.trim() !== '') {
            const isValidPassword = await user.validPassword(newPassword);
            if (isValidPassword) {
                throw new Error('New password cannot be the same as the current password');
            }
            user.password = newPassword;
        }

        // Handle profile image update
        let oldImageFilename = null;

        if (fileData && imagePath) {
            // Store old image filename for deletion after successful update
            if (user.profileImage) { // Make sure this matches your DB field name
                oldImageFilename = extractFilenameFromUrl(user.profileImage);
            }
            user.profileImage = imagePath; // Update with new image
        }

        await user.save({ transaction });
        await transaction.commit();

        // Delete old image after successful update
        if (oldImageFilename && fileData) {
            try {
                const deleteResult = await deleteImage(oldImageFilename);
                if (!deleteResult) {
                    console.warn(`Failed to delete old profile image: ${oldImageFilename}`);
                }
            } catch (deleteError) {
                console.warn(`Error deleting old profile image: ${deleteError.message}`);
            }
        }

        return user;
    } catch (error) {
        await transaction.rollback();

        // Cleanup new image if transaction failed
        if (fileData && imagePath) {
            try {
                const filename = extractFilenameFromUrl(imagePath);
                if (filename) {
                    await deleteImage(filename);
                }
            } catch (cleanupError) {
                console.warn(`Error cleaning up uploaded image: ${cleanupError.message}`);
            }
        }

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
  isVerificationCodeValid,
    updateUser
};