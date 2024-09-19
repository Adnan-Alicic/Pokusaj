const db = require('../models');
const bcrypt = require('bcryptjs');

// Kreiranje novog korisnika
exports.createUser = async(userData) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);

    return await db.User.create({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: hashedPassword,
        salt,
    });
};

// Proverava da li je email već registrovan
exports.isEmailRegistered = async(email) => {
    const user = await db.User.findOne({ where: { email } });
    return !!user; // Vraća true ako je email već registrovan
};

// Validacija lozinke prilikom prijave korisnika
exports.validatePassword = (enteredPassword, storedPassword, salt) => {
    const hashedPassword = bcrypt.hashSync(enteredPassword, salt);
    return hashedPassword === storedPassword;
};