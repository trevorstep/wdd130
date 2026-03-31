const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use port from environment variable or default to 3000

// Middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Configure CORS to allow requests from your frontend
// Replace 'https://your-portfolio-domain.com' with your actual portfolio domain
// For local development, you might use 'http://localhost:5500' or similar
app.use(cors({
    origin: ['http://localhost:5500', 'https://trevorstep.github.io', 'https://national-parks-app.onrender.com'], // Add all allowed origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Nodemailer transporter setup
// You'll need to replace these with your actual email service provider details
// For example, using Gmail:
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address (e.g., from .env)
        pass: process.env.EMAIL_PASS  // Your email password or app-specific password (e.g., from .env)
    }
});

// Contact form submission endpoint
app.post('/send-email', (req, res) => {
    const { user_name, user_email, user_message } = req.body;

    if (!user_name || !user_email || !user_message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: process.env.RECIPIENT_EMAIL, // Your email address where you want to receive messages
        subject: `New Contact from Portfolio: ${user_name}`,
        html: `
            <p><strong>Name:</strong> ${user_name}</p>
            <p><strong>Email:</strong> ${user_email}</p>
            <p><strong>Message:</strong></p>
            <p>${user_message}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send message.', error: error.message });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});