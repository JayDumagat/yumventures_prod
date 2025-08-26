const {login, register, findUserByEmail, saveVerificationCode, isVerificationCodeValid, changeUserPassword, updateUser} = require('../services/authService');
const sendVerificationCode = require('../services/emailService');


const loginWithUsername = async (req, res) => {
    const {username, password, rememberMe} = req.body;
    console.log('Login attempt with username:', username);
    try {
        const user = await login(username, password);
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials. Please try again.'});
        }


        req.session.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        }

        if (rememberMe) {
            
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; 
        } else {
           
            req.session.cookie.maxAge = 60 * 60 * 1000; 
        }


        return res.status(200).json({
            message: 'User logged in successfully',
            timestamp: new Date(),
            user: req.session.user
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const registerUser = async (req, res) => {
    const {firstName, lastName, email, username, password, role} = req.body;
    try {
        const user = await register(firstName, lastName, email, username, password, role);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({message: 'Failed to logout'});
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({message: 'User logged out successfully'});
    });
}

const getSession = (req, res) => {

    const { id, firstName, lastName, username, email, role, profileImage } = req.user;

    return res.status(200).json({
        user: {
            id,
            firstName,
            lastName,
            username,
            email,
            role,
            profileImage
        },
        timestamp: new Date().toISOString()
    });
}

const getEmailCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const verificationCode = await sendVerificationCode(email);
        
        const validUntil = new Date(Date.now() + 5 * 60 * 1000); 

        await saveVerificationCode(user.id, verificationCode, validUntil);

        return res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const validateVerificationCode = async (req, res) => {
    const {code} = req.body;
    try {
        const isValid = await isVerificationCodeValid(code);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        return res.status(200).json({ message: 'Verification code is valid' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const resetUserPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await changeUserPassword(user.id, password);

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        // Handle case where req.body might be undefined or empty
        const newPassword = req.body?.newPassword || null;
        const { id } = req.user; // This comes from authMiddleware


        const updatedUserProfile = await updateUser(id, newPassword, req.file);

        if(updatedUserProfile) {
            const sanitizedProfile = {
                id: updatedUserProfile.id,
                firstName: updatedUserProfile.firstName,
                lastName: updatedUserProfile.lastName,
                email: updatedUserProfile.email,
                username: updatedUserProfile.username,
                role: updatedUserProfile.role,
                profileImage: updatedUserProfile.profileImage,
            }

            req.session.user = sanitizedProfile;

            return res.status(200).json({
                message: 'User profile updated successfully',
                user: sanitizedProfile
            });
        }
        return res.status(500).json({
            message: 'Failed to update user profile'
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({
            message: error.message || 'Failed to update user profile'
        });
    }
}



module.exports = {
    loginWithUsername,
    registerUser,
    logoutUser,
    getSession,
    getEmailCode,
    validateVerificationCode,
    resetUserPassword,
    updateUserProfile,
}
