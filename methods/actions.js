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

    checkEmailExists: async function (req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, msg: 'Email is required' });
            }

            const user = await User.findOne({ email });
            if (user) {
                res.json({ exists: true, msg: 'Email already exists' });
            } else {
                res.json({ exists: false, msg: 'Email does not exist' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: 'Failed to check email' });
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
    },

    getUser: async function (req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }

            res.json({ success: true, user: user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: err });
        }
    },

    // Function to add an address to an existing user
    addAddress: async function (req, res) {
        try {
            const { email, address, pincode } = req.body;

            if (!address || !pincode) {
                return res.status(400).json({ success: false, msg: 'Address and pincode are required' });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }

            // Add new address to the user's addresses array
            user.addresses.push({ address, pincode });
            await user.save();

            res.json({ success: true, msg: 'Address added successfully', user: user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: 'Failed to add address' });
        }
    },

    // Function to retrieve user by email and return their addresses
    getUserAddresses: async function (req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, msg: 'Email is required' });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }

            res.json({ success: true, addresses: user.addresses });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: 'Failed to retrieve addresses' });
        }
    },

    // Function to delete a specific address from a user's addresses array
    deleteAddress: async function (req, res) {
        try {
            const { email, addressId } = req.body;

            if (!email || !addressId) {
                return res.status(400).json({ success: false, msg: 'Email and addressId are required' });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, msg: 'User not found' });
            }

            // Find the index of the address to remove
            const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
            if (addressIndex === -1) {
                return res.status(404).json({ success: false, msg: 'Address not found' });
            }

            // Remove the address from the array
            user.addresses.splice(addressIndex, 1);

            // Save the user object
            await user.save();

            res.json({ success: true, msg: 'Address deleted successfully', user: user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, msg: 'Failed to delete address' });
        }
    },

};

module.exports = functions;
