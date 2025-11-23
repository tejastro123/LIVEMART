// server/routes/users.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.put('/updatelocation', protect, async (req, res) => {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ msg: 'Latitude and longitude are required.' });
    }

    try {
        const user = await User.findById(req.user.id);
        
        user.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
        };

        await user.save();
        res.json({ msg: 'Location updated successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();
        res.json({ name: updatedUser.name, email: updatedUser.email });
        } else {
        res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) { res.status(500).send('Server Error'); }
});

router.put('/disconnect-google', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
        return res.status(404).json({ msg: 'User not found' });
        }

        // Clear the Google-related fields
        user.googleId = undefined;
        user.googleAccessToken = undefined;
        user.googleRefreshToken = undefined;

        await user.save();
        
        // Send back a partial user object to update the frontend state
        res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isGoogleConnected: false // Explicitly set to false
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/addresses', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');
        res.json(user.addresses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/addresses', protect, async (req, res) => {
    const { addressLabel, street, city, postalCode, country, isDefault } = req.body;
    const newAddress = { addressLabel, street, city, postalCode, country, isDefault };

    try {
        const user = await User.findById(req.user.id);

        // If setting this as default, unset others
        if (newAddress.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
        }
        // Ensure at least one address is default if none are set
        else if (!user.addresses.some(addr => addr.isDefault) && user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json(user.addresses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/addresses/:addressId', protect, async (req, res) => {
    const { addressLabel, street, city, postalCode, country, isDefault } = req.body;
    const updatedAddressData = { addressLabel, street, city, postalCode, country, isDefault };

    try {
        const user = await User.findById(req.user.id);
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);

        if (addressIndex === -1) {
            return res.status(404).json({ msg: 'Address not found' });
        }

        // If setting this as default, unset others
        if (updatedAddressData.isDefault) {
            user.addresses.forEach((addr, index) => {
                addr.isDefault = (index === addressIndex);
            });
        }
        // Prevent unsetting the only default address
        else if (user.addresses[addressIndex].isDefault && user.addresses.length > 1) {
             // If trying to unset the current default, find another to set as default (e.g., the first one)
            if (!user.addresses.some((addr, index) => index !== addressIndex && addr.isDefault)) {
                const newDefaultIndex = user.addresses.findIndex((addr, index) => index !== addressIndex);
                if (newDefaultIndex !== -1) user.addresses[newDefaultIndex].isDefault = true;
            }
        } else if (user.addresses.length === 1) {
            // Ensure the only address remains default
            updatedAddressData.isDefault = true;
        }


        // Update the specific address fields
        user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updatedAddressData };
        
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Likely in server/routes/users.js

/**
 * @route   DELETE /api/users/addresses/:addressId
 * @desc    Delete a saved address
 * @access  Private
 */
router.delete('/addresses/:addressId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
        return res.status(404).json({ msg: 'User not found' });
        }

        // --- THIS IS THE FIX ---
        // Use the pull() method on the addresses array to remove the item
        user.addresses.pull({ _id: req.params.addressId }); 
        // ----------------------

        await user.save(); // Save the parent user document

        res.json(user.addresses); // Return the updated list of addresses
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;