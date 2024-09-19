const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const router = express.Router();

// Ruta za prijavu korisnika
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async(err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: 'Neispravan email ili lozinka' });

        req.logIn(user, async(err) => {
            if (err) return next(err);

            const token = jwt.sign({ id: user.id, role: user.role }, 'tajna', { expiresIn: '1h' });
            console.log('Generisan token:', token);

            // Pronađi korisnika u bazi kako bi dobio sektor (ako već nije dio autentifikacije)
            const userWithSector = await db.User.findOne({
                where: { id: user.id },
                attributes: ['id', 'firstname', 'lastname', 'email', 'role', 'sector'] // Dodaj sektor ovde
            });

            // Vraćamo sve potrebne informacije o korisniku
            return res.json({
                message: 'Prijava uspješna',
                token,
                user: {
                    id: userWithSector.id,
                    firstname: userWithSector.firstname,
                    lastname: userWithSector.lastname,
                    email: userWithSector.email,
                    role: userWithSector.role,
                    sector: userWithSector.sector // Dodaj sektor u odgovor
                },
                redirect: user.role === 'Admin' ? '/admin-dashboard' : user.role === 'Sector Manager' ? '/dashboard' : user.role === 'User' ? '/worker-dashboard' : '/'
            });
        });
    })(req, res, next);
});

// Ruta za registraciju korisnika
router.post('/signup', async(req, res) => {
    try {
        const { firstname, lastname, email, password, sector } = req.body; // Pretpostavka da sektor dolazi sa podacima
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        await db.User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            salt,
            sector // Sačuvaj sektor u bazu
        });

        res.json({ message: 'Registracija uspješna' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška prilikom registracije' });
    }
});

// Ruta za odjavu korisnika
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Odjava uspješna' });
});

module.exports = router;