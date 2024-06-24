const User = require('../model/user');
const jwt = require('jwt-simple');
const config = require('../config/dbconfig');

const functions = {
    addNew: async function (req, res) {
        try {
            const { firstname, lastname, phone, email, password } = req.body;
            if (!firstname || !lastname || !phone || !email || !password) {
                return res.status(400).json({ success: false, msg: 'Enter all fields' });
            }

            const newUser = new User({
                firstname,
                lastname,
                phone,
                email,
                password
            });

            await newUser.save();
            res.json({ success: true, msg: 'Successfully saved' });
        } catch (err) {
            console.error(err);
            if (err.code === 11000) {
                res.status(400).json({ success: false, msg: 'Email already exists' });
            } else {
                res.status(500).json({ success: false, msg: 'Failed to save' });
            }
        }
    },

    updateinfo: async function (req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, msg: 'Email and password are required' });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, msg: 'Email not found' });
            }

            user.password = password;
            await user.save();
            res.json({ success: true, msg: 'Successfully updated password' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: 'Failed to update password' });
        }
    },

    authenticate: async function (req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }

            user.comparePassword(password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ success: false, msg: 'Wrong password' });
                }

                const token = jwt.encode(user, config.secret);
                res.json({ success: true, token });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: 'Authentication failed' });
        }
    },

    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decodedtoken = jwt.decode(token, config.secret);
                res.json({ success: true, msg: `Hello ${decodedtoken.firstname}` });
            } catch (err) {
                res.status(401).json({ success: false, msg: 'Invalid token' });
            }
        } else {
            res.status(400).json({ success: false, msg: 'No headers' });
        }
    }
};

module.exports = functions;
