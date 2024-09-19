const userService = require('../services/userService');
const passport = require('passport');

// Registracija novog korisnika
exports.register = async(req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Provera da li je email već registrovan
        if (await userService.isEmailRegistered(email)) {
            return res.status(400).json({ error: 'Email je već registrovan.' });
        }

        // Kreiranje novog korisnika
        const user = await userService.createUser({ firstname, lastname, email, password });

        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nešto je pošlo po zlu prilikom registracije.' });
    }
};

// Prijava korisnika
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ error: 'Pogrešni podaci za prijavu.' });

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json(user);
        });
    })(req, res, next);
};

// Odjava korisnika
exports.logout = (req, res) => {
    req.logout();
    res.json({ message: 'Uspešno ste se odjavili.' });
};