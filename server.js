require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Placeholder for cron service
const {startCronJobs} = require('./services/cronService');

const PORT = process.env.PORT || 3000;

// Connect to the database, then start the server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);

		// Initialize scheduled tasks
		startCronJobs();
	});
});
