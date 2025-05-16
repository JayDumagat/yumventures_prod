const {login, register, findUserByEmail, saveVerificationCode, isVerificationCodeValid, changeUserPassword} = require('../services/authService');
const sendVerficationCode = require('../services/emailService');


const loginWithUsername = async (req, res) => {
    const {username, password, rememberMe} = req.body;
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

    const { id, firstName, username, email, role } = req.user;

    return res.status(200).json({
        user: {
            id,
            firstName,
            username,
            email,
            role
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

        const verificationCode = await sendVerficationCode(email);
        
        const validUntil = new Date(Date.now() + 5 * 60 * 1000); 

        saveVerificationCode(user.id, verificationCode, validUntil);

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



module.exports = {
    loginWithUsername,
    registerUser,
    logoutUser,
    getSession,
    getEmailCode,
    validateVerificationCode,
    resetUserPassword
}
