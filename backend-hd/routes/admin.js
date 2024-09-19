const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta za kreiranje novog korisnika
router.post('/create-user', ensureAuthenticated, ensureAdmin, async(req, res) => {
    const { firstname, lastname, email, password, role, sector } = req.body;

    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        await db.User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            sector,
            salt
        });

        res.status(201).json({ message: 'Korisnik kreiran uspješno.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška prilikom kreiranja korisnika.' });
    }
});

// Ruta za dobijanje svih korisnika
router.get('/users', ensureAuthenticated, ensureAdmin, async(req, res) => {
    try {
        const users = await db.User.findAll();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Greška prilikom preuzimanja korisnika.' });
    }
});

// PUT ruta za promenu podataka postojećeg korisnika
router.put('/users/:id', ensureAuthenticated, ensureAdmin, async(req, res) => {
    const { id } = req.params; // Uzmite ID korisnika iz parametara
    const { firstname, lastname, email, role } = req.body; // Uzmite nove podatke iz tela zahteva

    try {
        const user = await db.User.findByPk(id); // Pronađite korisnika po ID
        if (!user) {
            return res.status(404).json({ message: 'Korisnik nije pronađen.' });
        }

        // Ažurirajte podatke
        user.firstname = firstname; // Ažurirajte ime
        user.lastname = lastname; // Ažurirajte prezime
        user.email = email; // Ažurirajte email 
        user.role = role; // Ažurirajte rolu
        await user.save(); // Sačuvajte promene

        res.json({ message: 'Podaci korisnika su uspešno ažurirani.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška prilikom ažuriranja korisnika.' });
    }
});



// DELETE ruta za brisanje korisnika
router.delete('/delete-user/:id', ensureAuthenticated, ensureAdmin, async(req, res) => {
    const { id } = req.params; // Uzmite ID korisnika iz parametara

    try {
        const user = await db.User.findByPk(id); // Pronađite korisnika po ID
        if (!user) {
            return res.status(404).json({ message: 'Korisnik nije pronađen.' });
        }

        await user.destroy(); // Izbrišite korisnika iz baze
        res.status(204).send(); // Vratite 204 No Content
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška prilikom brisanja korisnika.' });
    }
});

module.exports = router;

/*router.put('/users/:id', ensureAuthenticated, ensureAdmin, async(req, res) => {
    const { id } = req.params; // Uzmite ID korisnika iz parametara
    const { firstname, lastname, email } = req.body; // Uzmite nove podatke iz tela zahteva

    try {
        const user = await db.User.findByPk(id); // Pronađite korisnika po ID
        if (!user) {
            return res.status(404).json({ message: 'Korisnik nije pronađen.' });
        }

        user.firstname = firstname; // Ažurirajte ime
        user.lastname = lastname; // Ažurirajte prezime
        user.email = email; // Ažurirajte email
        user.role = role; // Ažurirajte rolu
        await user.save(); // Sačuvajte promene

        res.json({ message: 'Podaci korisnika su uspešno ažurirani.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška prilikom ažuriranja korisnika.' });
    }
});*/