const nodemailer = require('nodemailer');
const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);
const path = require('path');
const ejs = require('ejs');

const getTransporter = async () => {
	try {
		const t = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587, 
			secure: false, // upgrade later with STARTTLS
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		await t.verify();
		console.log('Connected via SMTP successfully');
		return t;
	} catch (err) {
		console.error('SMTP Connection Failed:', err.message);
		throw new Error('Failed to connect to SMTP server');
	}
};

const sendBirthdayEmail = async (user) => {
	try {
		const t = await getTransporter();
		const templatePath = path.join(__dirname, '../views/email.ejs');
		const htmlContent = await ejs.renderFile(templatePath, {
			username: user.username,
		});

		const mailOptions = {
			from: `"Birthday App" <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: 'Happy Birthday! 🎉',
			html: htmlContent,
		};

		const info = await t.sendMail(mailOptions);
		console.log(`Email sent to ${user.email}: ${info.messageId}`);
		return true;
	} catch (error) {
		console.error('FULL EMAIL ERROR:', JSON.stringify(error, null, 2));
		console.error('ERROR MESSAGE:', error.message);
		return false;
	}
};

module.exports = { sendBirthdayEmail };
