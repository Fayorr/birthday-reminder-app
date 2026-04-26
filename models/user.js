const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		dateOfBirth: {
			type: Date,
			required: [true, 'Date of birth is required'],
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('users', userSchema);
