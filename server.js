const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname)));

// Mail transport (configure via env)
const mailTransport = nodemailer.createTransport({
	host: process.env.SMTP_HOST || 'localhost',
	port: Number(process.env.SMTP_PORT || 1025),
	secure: false,
	auth: process.env.SMTP_USER
		? {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS || ''
		}
		: undefined,
});

function buildHtmlMessageFromQuote(body) {
	const name = body['Name '] || body.name || '';
	const email = body['E-mail '] || body.email || '';
	const phone = body['Phone number '] || body.phone || '';
	const contactWay = body['How to contact with client '] || body.choice || '';
	const message = body['Message '] || body.message || '';
	const projectType = body['Type of project '] || body.project || '';

	return `
		<h1>New Project Quote</h1>
		<p><strong>Name:</strong> ${name}</p>
		<p><strong>Email:</strong> ${email}</p>
		<p><strong>Phone:</strong> ${phone}</p>
		<p><strong>Preferred contact:</strong> ${contactWay}</p>
		<p><strong>Project type:</strong> ${projectType}</p>
		<p><strong>Message:</strong><br/>${message}</p>
	`;
}

app.post('/api/quote', async (req, res) => {
	try {
		const html = buildHtmlMessageFromQuote(req.body);
		if (process.env.MAIL_TO) {
			await mailTransport.sendMail({
				from: process.env.MAIL_FROM || 'no-reply@example.com',
				to: process.env.MAIL_TO,
				subject: 'New Quote Request',
				html,
			});
		}
		return res.json({ message: 'Quote submitted successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to submit quote' });
	}
});

app.post('/api/feedback', async (req, res) => {
	try {
		const text = (req.body.text || '').toString().trim();
		if (!text) return res.status(400).json({ message: 'Feedback text is required' });
		if (process.env.MAIL_TO) {
			await mailTransport.sendMail({
				from: process.env.MAIL_FROM || 'no-reply@example.com',
				to: process.env.MAIL_TO,
				subject: 'New Feedback',
				html: `<p>${text}</p>`
			});
		}
		return res.json({ message: 'Feedback submitted successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Failed to submit feedback' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});