const nodemailer = require('nodemailer');
const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);
const path = require('path');
const ejs = require('ejs');

let transporter;

const getTransporter = async () => {
	if (transporter) return transporter;

	// Force IPv4 DNS resolution at startup
	const [ipv4] = await resolve4('smtp.gmail.com');

	transporter = nodemailer.createTransport({
		host: ipv4,
		port: 465,
		secure: true,
		pool: true,
		connectionTimeout: 20000,
		greetingTimeout: 20000,
		socketTimeout: 20000,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false,
			servername: 'smtp.gmail.com',
		},
	});

	return transporter;
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
		console.error('FULL EMAIL ERROR:', JSON.stringify(error, null, 2)); // 👈 add this
		console.error('ERROR MESSAGE:', error.message); // 👈 and this
		return false;
	}
};

module.exports = { sendBirthdayEmail };
