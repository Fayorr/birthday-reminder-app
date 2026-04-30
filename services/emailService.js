const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Updated, Render-friendly email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        // This is the magic line that bypasses strict cloud network checks
        rejectUnauthorized: false
    }
});

const sendBirthdayEmail = async (user) => {
	try {
		// Path to the EJS template
		const templatePath = path.join(__dirname, '../views/email.ejs');

		// Render the EJS template to an HTML string, passing the username
		const htmlContent = await ejs.renderFile(templatePath, {
			username: user.username,
		});

		// Define email options
		const mailOptions = {
			from: `"Birthday App" <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: 'Happy Birthday! 🎉',
			html: htmlContent,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
		console.log(`Email sent to ${user.email}: ${info.messageId}`);
		return true;
	} catch (error) {
		console.error(`Failed to send email to ${user.email}:`, error);
		return false;
	}
};

module.exports = {
	sendBirthdayEmail,
};
