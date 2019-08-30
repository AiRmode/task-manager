const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = process.env.SENDGRID_API_TOKEN;

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ashevchuk@determine.com',
        subject: 'Welcome to Task-App!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
};

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ashevchuk@determine.com',
        subject: `Sorry to miss you ${name}`,
        text: `What can we do for you to be satisfied with our services? Anyway - all the best ${name}!`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
};