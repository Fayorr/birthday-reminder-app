const nodemailer = require('nodemailer');
const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);
const path = require('path');
const ejs = require('ejs');

// ❌ Remove the cached transporter — always resolve fresh
const getTransporter = async () => {
	const ipv4Addresses = await resolve4('smtp.gmail.com'); // get ALL IPs
	console.log('Resolved SMTP IPs:', ipv4Addresses);

	// Try each IP until one works
	for (const ip of ipv4Addresses) {
		try {
			const t = nodemailer.createTransport({
				host: ip,
				port: 465,
				secure: true,
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

			await t.verify(); // test this IP actually works
			console.log(`Connected via SMTP IP: ${ip}`);
			return t;
		} catch (err) {
			console.warn(`IP ${ip} failed, trying next...`, err.message);
		}
	}

	throw new Error('All SMTP IPs failed');
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
