const express = require('express');
const router = express.Router();
const db = require('../models');

// Ispravna definicija rute
router.get('/tasks', async(req, res) => {
    try {
        const tasks = await db.Task.findAll();
        res.json(tasks);
    } catch (error) {
        console.error('Greška prilikom dohvatanja taskova:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

router.get('/workers', async(req, res) => {
    const sector = req.query.sector;

    if (!sector) {
        return res.status(400).json({ message: 'Sektor je potreban' });
    }

    try {
        const workers = await db.User.findAll({
            where: { sector: sector }
        });

        if (workers.length === 0) {
            return res.status(404).json({ message: 'Nema radnika u ovom sektoru' });
        }

        res.json(workers);
    } catch (error) {
        console.error('Greška prilikom dohvata radnika:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});



module.exports = router;