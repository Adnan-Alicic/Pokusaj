const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const sendEmail = require('../services/emailService');
// Ruta za dohvaćanje jedinstvenih sektora iz tabele Users
router.get('/sectors', async(req, res) => {
    try {
        const sectors = await db.User.findAll({
            attributes: [
                [db.sequelize.fn('DISTINCT', db.sequelize.col('sector')), 'sector']
            ],
            where: {
                sector: {
                    [Op.ne]: null // Ignoriraj null vrijednosti ako postoje
                }
            }
        });

        const sectorNames = sectors.map(sector => sector.sector);
        res.json(sectorNames); // Ovdje se vraća JSON odgovor
    } catch (error) {
        console.error('Greška prilikom dohvata sektora:', error.message);
        res.status(500).json({ message: 'Greška na serveru', error: error.message });
    }
});


// Ruta za dohvaćanje prijava smetnji bez kreiranih taskova
router.get('/all-complaints', async(req, res) => {
    try {
        const complaints = await db.PrijavaSmetnji.findAll({
            where: { hasTask: false } // Samo prijave smetnji bez kreiranog taska
        });

        res.json({ complaints });
    } catch (error) {
        console.error('Greška prilikom dohvata prijava smetnji:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

// Ruta za prijavu smetnje
router.post('/', async(req, res) => {
    const { name, email, sector, message } = req.body;

    try {
        const newIssue = await db.PrijavaSmetnji.create({
            ime: name,
            email,
            sektor: sector,
            opis: message,
            status: 'Nije ovjereno'
        });

        // Nađi šefa sektora na osnovu sektora
        const sectorManager = await db.User.findOne({ where: { sector, role: 'Sector Manager' } });

        if (sectorManager) {
            const subject = `Nova prijava smetnje u sektoru: ${sector}`;
            const text = `Radnik ${name} je prijavio smetnju: "${message}". Molimo da pregledate prijavu.`;

            // Pošalji email šefu sektora
            await sendEmail(sectorManager.email, subject, text);
        }

        res.status(201).json({ message: 'Smetnja je uspješno prijavljena!', issue: newIssue });
    } catch (error) {
        console.error('Greška prilikom prijave smetnje:', error.message);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

// Ruta za ovjeru prijave
router.put('/complaints/verify/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const complaint = await db.PrijavaSmetnji.findByPk(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Prijava nije pronađena' });
        }

        complaint.status = 'Ovjereno';
        await complaint.save();

        res.json({ message: 'Prijava je ovjerena' });
    } catch (error) {
        console.error('Greška prilikom ovjere prijave:', error.message);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

// Ruta za kreiranje taska i ovjeru prijave smetnji
router.put('/create-task/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const complaint = await db.PrijavaSmetnji.findByPk(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Prijava smetnji nije pronađena' });
        }
        complaint.hasTask = true; // Označava da je task kreiran za ovu prijavu smetnji
        await complaint.save();

        res.json({ message: 'Task kreiran i prijava smetnji ažurirana' });
    } catch (error) {
        console.error('Greška prilikom kreiranja taska:', error.message);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});





module.exports = router;