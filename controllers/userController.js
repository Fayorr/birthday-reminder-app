const User = require('../models/user');

// Render the main form page
const renderHomePage = (req, res) => {
	res.render('index');
};

// Handle form submission to save a new user
const createUser = async (req, res) => {
	try {
		const { username, email, dateOfBirth } = req.body;

		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.render('index', {
				error: 'This email is already registered.',
				success: null,
			});
		}

		// Create new user
		await User.create({ username, email, dateOfBirth });

		res.render('index', {
			success: 'Birthday saved successfully!',
			error: null,
		});
	} catch (error) {
		console.error('Error creating user:', error);
		res.render('index', {
			error: 'An error occurred while saving the data. Please try again.',
			success: null,
		});
	}
};

module.exports = {
	renderHomePage,
	createUser,
};
