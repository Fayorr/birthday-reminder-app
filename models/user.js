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
			type: String,
			required: [true, 'Date of birth is required'],
			match: [
				/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
				'Date of birth must be in MM-DD format',
			],
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('users', userSchema);
