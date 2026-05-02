const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);

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
		const t = await getTransporter(); // ✅ Get IPv4-resolved transporter
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
		console.error(`Failed to send email to ${user.email}:`, error);
		return false;
	}
};

module.exports = { sendBirthdayEmail };