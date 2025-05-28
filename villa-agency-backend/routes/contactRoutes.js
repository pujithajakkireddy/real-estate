// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Your MongoDB model
const nodemailer = require('nodemailer');     // <--- NEW: Import nodemailer

// POST a new contact message
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body; // Destructure for easier access

    // 1. --- Save to Database ---
    const contact = new Contact({
        name,
        email,
        subject,
        message
    });

    try {
        const newContact = await contact.save();
        console.log('Contact message saved to DB:', newContact); // Log to confirm DB save

        // 2. --- Email Sending Logic ---
        // Create a Nodemailer transporter using your .env details
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for 465 (SSL), false for other ports like 587 (TLS)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // This should be your App Password for Gmail
            },
            tls: {
                // Do not fail on invalid certs - useful for some local dev/testing, but be cautious in production
                // You might need this if you encounter self-signed certificate errors
                rejectUnauthorized: false
            }
        });

        // Define email options
        let mailOptions = {
            from: `"${name}" <${email}>`, // Sender address, uses the name/email from the form
            to: process.env.RECIPIENT_EMAIL, // Your email address where you want to receive messages
            subject: `New Contact Form: ${subject || 'No Subject'}`,
            html: `
                <p>You have a new contact message from your website:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Subject:</strong> ${subject || 'N/A'}</li>
                </ul>
                <h3>Message:</h3>
                <p>${message}</p>
            `
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        // If you're testing, you can use Ethereal.email for a test account and check the preview URL:
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Send a success response back to the frontend
        res.status(201).json({ message: 'Contact message submitted and email sent successfully!', data: newContact });

    } catch (error) {
        // This catch block handles errors from both DB save AND email sending
        console.error('Error processing contact form or sending email:', error);
        if (error.name === 'ValidationError') { // Mongoose validation error
            return res.status(400).json({ message: error.message });
        }
        // For email sending errors, provide a more informative message
        res.status(500).json({ message: 'Failed to process contact message or send email.', error: error.message });
    }
});

// Optional: GET all contact messages (for admin purposes, requires authentication)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;