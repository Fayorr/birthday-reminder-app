const cron = require('node-cron');
const User = require('../models/user');
const { sendBirthdayEmail } = require('./emailService');

// Helper to check if current year is a leap year
const isLeapYear = (year) => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const startCronJobs = () => {
	// Run every day at 7:00 AM, Africa/Lagos timezone
	cron.schedule(
		'0 7 * * *',
		async () => {
			console.log('Running daily birthday check...');

			const today = new Date();
			const currentMonth = today.getMonth() + 1;
			const currentDay = today.getDate();
			const currentYear = today.getFullYear();

			try {
				// Format today as MM-DD to match stored format
				const mm = String(currentMonth).padStart(2, '0');
				const dd = String(currentDay).padStart(2, '0');

				let query = { dateOfBirth: `${mm}-${dd}` };

				// Leap year logic: If today is Feb 28 and it is NOT a leap year,
				// we also want to send emails to people born on Feb 29.
				if (
					currentMonth === 2 &&
					currentDay === 28 &&
					!isLeapYear(currentYear)
				) {
					query = { dateOfBirth: { $in: ['02-28', '02-29'] } };
				}

				const celebrants = await User.find(query);

				if (celebrants.length === 0) {
					console.log('No birthdays today.');
					return;
				}

				console.log(
					`Found ${celebrants.length} birthday(s) today. Sending emails...`,
				);

				// Send emails concurrently
				const emailPromises = celebrants.map((user) => sendBirthdayEmail(user));
				await Promise.all(emailPromises);

				console.log('Finished sending birthday emails.');
			} catch (error) {
				console.error('Error during the daily birthday check:', error);
			}
		},
		{
			scheduled: true,
			timezone: 'Africa/Lagos',
		},
	);

	console.log('Cron jobs initialized.');
};

module.exports = { startCronJobs, isLeapYear };
