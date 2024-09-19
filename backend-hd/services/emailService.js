const nodemailer = require('nodemailer');

// Kreiraj transporter za slanje emaila
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'test.sagas.1234@gmail.com', // Ovdje unesi stvarni email i lozinku
        pass: 'kmvh pmqa drrv hedh',
    },
});

// Funkcija za slanje emaila
const sendEmail = async(to, subject, text) => {
    const mailOptions = {
        from: 'test.sagas.1234@gmail.com',
        to,
        subject,
        text,
        html: `<p>${text}</p>`
    };

    try {
        // Log za praćenje
        console.log(`Pokušaj slanja emaila na: ${to} sa subjectom: ${subject}`);

        const info = await transporter.sendMail(mailOptions);

        // Log ako je email uspješno poslan
        console.log(`Email uspješno poslan: ${info.response}`);

    } catch (error) {
        // Log greške prilikom slanja emaila
        console.error('Greška prilikom slanja emaila:', error);
    }
};

module.exports = sendEmail;