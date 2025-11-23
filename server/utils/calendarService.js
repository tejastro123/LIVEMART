// server/utils/calendarService.js
const { google } = require('googleapis');

const createCalendarEvent = async (user, order) => {
    if (!user.googleRefreshToken) {
        return console.log('User has not connected their Google account.');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        '/api/auth/google/callback'
    );

    oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDate() + 2); // Event for 2 days from now
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event = {
        summary: `Live MART Order Delivery #${order._id.toString().slice(-6)}`,
        description: `Your order with a total of $${order.totalAmount.toFixed(2)} is scheduled for delivery.`,
        start: { dateTime: eventStartTime.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: eventEndTime.toISOString(), timeZone: 'Asia/Kolkata' },
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', 'minutes': 60 }],
        },
    };

    try {
        await calendar.events.insert({ calendarId: 'primary', resource: event });
        console.log('Calendar event created successfully.');
    } catch (err) {
        console.error('Error creating calendar event:', err.message);
    }
};

module.exports = { createCalendarEvent };