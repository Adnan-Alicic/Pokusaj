const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/emailService'); // Putanja do fajla u kojem je funkcija sendEmail


router.get('/all-tasks', async(req, res) => {
    try {
        const tasks = await db.Taskovi.findAll({
            include: [{
                model: db.User,
                as: 'User', // Ovo mora biti isto kao što je definirano u modelu Taskovi
                attributes: ['firstname', 'lastname'], // Atributi koje želiš prikazati
            }]
        });

        console.log('Dohvaćeni taskovi:', tasks);
        res.json(tasks); // Provjeri da li se šalju unutar objekta
    } catch (error) {
        console.error('Greška prilikom dohvata taskova:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});;

router.put('/verify-task/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const task = await db.Taskovi.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task nije pronađen' });
        }

        task.verifikacija = true;
        await task.save();

        // Ažuriranje prijave smetnje, ako postoji
        if (task.prijavaSmetnjiId) {
            const complaint = await db.PrijavaSmetnji.findByPk(task.prijavaSmetnjiId);
            if (complaint) {
                complaint.hasTask = false; // Task je ovjeren, sada uklanjamo prijavu
                await complaint.save();
            }
        }

        res.json({ message: 'Task je uspješno ovjeren' });
    } catch (error) {
        console.error('Greška prilikom verifikacije taska:', error.message);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

// API za ažuriranje statusa na "Završeno" od strane radnika
router.put('/complete-task/:id', async(req, res) => {
    try {
        const taskId = req.params.id;
        const task = await db.Taskovi.findByPk(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task nije pronađen' });
        }

        // Provjeri da li task ima sektor, ako nema, postavi grešku
        if (!task.sector) {
            return res.status(400).json({ message: 'Task nema definisan sektor' });
        }

        // Ruta za dohvaćanje svih taskova
        router.get('/all-tasks', async(req, res) => {
            try {
                const tasks = await db.Taskovi.findAll({
                    include: [{
                        model: db.User,
                        as: 'User', // Ime relacije kako je definirano u modelu Taskovi
                        attributes: ['firstname', 'lastname'], // Atributi korisnika koje želimo prikazati
                    }]
                });

                console.log('Dohvaćeni taskovi:', tasks);
                res.json(tasks);
            } catch (error) {
                console.error('Greška prilikom dohvata taskova:', error);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });

        // Ruta za ovjeru taska od strane šefa sektora
        router.put('/verify-task/:id', async(req, res) => {
            const { id } = req.params;

            try {
                const task = await db.Taskovi.findByPk(id);
                if (!task) {
                    return res.status(404).json({ message: 'Task nije pronađen' });
                }

                task.verifikacija = true; // Oznaka da je task ovjeren
                await task.save();

                // Ažuriraj prijavu smetnji, ako postoji, uklanjajući oznaku `hasTask`
                if (task.prijavaSmetnjiId) {
                    const complaint = await db.PrijavaSmetnji.findByPk(task.prijavaSmetnjiId);
                    if (complaint) {
                        complaint.hasTask = false; // Task je ovjeren, prijava više nije aktivna
                        await complaint.save();
                    }
                }

                res.json({ message: 'Task je uspješno ovjeren' });
            } catch (error) {
                console.error('Greška prilikom verifikacije taska:', error.message);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });

        // Ruta za završavanje taska od strane radnika
        router.put('/complete-task/:id', async(req, res) => {
            try {
                const taskId = req.params.id;
                const task = await db.Taskovi.findByPk(taskId);

                if (!task) {
                    return res.status(404).json({ message: 'Task nije pronađen' });
                }

                if (!task.sector) {
                    return res.status(400).json({ message: 'Task nema definisan sektor' });
                }

                task.status = 'Završeno';
                await task.save();

                // Pronađi radnika koji je završio task
                const user = await db.Users.findByPk(task.userId);
                if (!userser) {
                    console.log('Korisnik nije pronađen');
                    return res.status(404).json({ message: 'Korisnik nije pronađen' });
                }

                console.log('Ime korisnika:', user.firstname);
                console.log('Prezime korisnika:', user.lastname);


                // Pronađi šefa sektora kojem treba poslati email
                const sectorManager = await db.User.findOne({
                    where: {
                        sector: task.sector,
                        role: 'Sector Manager'
                    }
                });

                if (sectorManager) {
                    console.log(`Slanje emaila na: ${sectorManager.email}`);

                    const subject = `Task je završen: ${task.sifra_taska}`;
                    const text = `Radnik ${user.firstname} ${user.lastname} je završio task: "${task.naziv_taska}" sa šifrom: ${task.sifra_taska}. Molimo da ga ovjerite.`;

                    console.log(`Tekst emaila: ${text}`); // Dodaj log za tekst emaila

                    await sendEmail(sectorManager.email, subject, text);
                } else {
                    console.log('Nema voditelja sektora za slanje emaila.');
                }

                res.json({ message: 'Task je uspješno završen i email je poslan šefu sektora!' });
            } catch (error) {
                console.error('Greška prilikom završavanja taska:', error);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });

        // Ruta za kreiranje novog taska
        router.post('/create-task', async(req, res) => {
            try {
                const { prijavaSmetnjiId, sifra_taska, naziv_taska, tekst_taska, prioritet, userId } = req.body;

                // Pronađi radnika da bi dohvatio sektor
                const radnik = await db.User.findByPk(userId);
                if (!radnik || !radnik.sector) {
                    return res.status(400).json({ message: 'Radnik nema definisan sektor' });
                }

                // Kreiranje novog taska sa sektorom
                const newTask = await db.Taskovi.create({
                    prijavaSmetnjiId,
                    sifra_taska,
                    naziv_taska,
                    tekst_taska,
                    prioritet,
                    status: 'U toku',
                    userId,
                    sector: radnik.sector // Dodaj sektor radnika u task
                });

                res.json(newTask);
            } catch (error) {
                console.error('Greška prilikom kreiranja taska:', error);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });



        // Ruta za dohvaćanje taskova specifičnih za određenog korisnika
        router.get('/user-tasks/:userId', async(req, res) => {
            const { userId } = req.params;

            if (!userId || userId === 'undefined') {
                return res.status(400).json({ message: 'Neispravan userId' });
            }

            try {
                const tasks = await db.Taskovi.findAll({
                    where: { userId },
                    include: [{
                        model: db.User,
                        as: 'User',
                        attributes: ['firstname', 'lastname'],
                    }]
                });

                if (tasks.length === 0) {
                    return res.status(404).json({ message: 'Nema taskova za ovog korisnika' });
                }

                res.json(tasks);
            } catch (error) {
                console.error('Greška prilikom dohvata taskova za korisnika:', error);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });

        // Ruta za dohvaćanje radnika po sektoru
        router.get('/workers', async(req, res) => {
            const { sector } = req.query;

            try {
                const workers = await db.User.findAll({
                    where: { sector }
                });

                if (workers.length === 0) {
                    return res.status(404).json({ message: 'Nema radnika za navedeni sektor' });
                }

                res.json(workers);
            } catch (error) {
                console.error('Greška prilikom dohvata radnika:', error.message);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });

        // Ruta za dohvaćanje taskova specifičnih za radnika
        router.get('/worker-tasks', async(req, res) => {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Izvuci token iz Authorization header-a

            if (!token) return res.status(401).json({ message: 'Pristup odbijen. Nema tokena.' });

            try {
                const decoded = jwt.verify(token, 'tajna'); // Dekodiraj token koristeći tvoju tajnu
                const userId = decoded.id; // Preuzmi ID korisnika iz tokena

                const tasks = await db.Taskovi.findAll({
                    where: { userId }
                });

                if (tasks.length === 0) {
                    return res.status(404).json({ message: 'Nema taskova za prikaz.' });
                }

                res.json(tasks);
            } catch (error) {
                console.error('Greška prilikom dohvata taskova:', error);
                res.status(500).json({ message: 'Greška na serveru' });
            }
        });

        module.exports = router;

        // Ažuriraj status taska na 'Završeno'
        task.status = 'Završeno';
        await task.save();

        // Pronađi šefa sektora kojem treba poslati email
        const sectorManager = await db.User.findOne({
            where: {
                sector: task.sector, // Pretpostavi da task ima 'sector' polje
                role: 'Sector Manager' // Role šefa sektora
            }
        });

        if (sectorManager) {
            const subject = `Task je završen: ${task.sifra_taska}`;
            const text = `Radnik je završio task: "${task.naziv_taska}" sa šifrom: ${task.sifra_taska}. Molimo da ga ovjerite.`;

            // Pošalji email šefu sektora
            await sendEmail(sectorManager.email, subject, text);
        }

        res.json({ message: 'Task je uspješno završen i email je poslan šefu sektora!' });
    } catch (error) {
        console.error('Greška prilikom završavanja taska:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});




router.post('/create-task', async(req, res) => {
    try {
        const { prijavaSmetnjiId, sifra_taska, naziv_taska, tekst_taska, prioritet, userId } = req.body;

        // Kreiranje novog taska
        const newTask = await db.Taskovi.create({
            prijavaSmetnjiId,
            sifra_taska,
            naziv_taska,
            tekst_taska,
            prioritet,
            status: 'U toku',
            userId
        });

        // Ažuriranje PrijavaSmetnji hasTask na true
        if (prijavaSmetnjiId) {
            await db.PrijavaSmetnji.update({ hasTask: true }, { where: { id: prijavaSmetnjiId } });
        }

        const radnik = await db.User.findByPk(userId);
        if (radnik) {
            const subject = `Novi task: ${sifra_taska}`;
            const text = `Dobili ste novi task: "${naziv_taska}" sa šifrom: ${sifra_taska}. Molimo da obratite pažnju.`;

            // Pošalji email radniku
            await sendEmail(radnik.email, subject, text);
        }

        res.json(newTask);
    } catch (error) {
        console.error('Greška prilikom kreiranja taska:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

// Ruta za dohvaćanje taskova specifičnih za određenog korisnika
router.get('/user-tasks/:userId', async(req, res) => {
    const { userId } = req.params;
    console.log('Primljen userId:', userId);

    if (userId === 'undefined' || !userId) {
        return res.status(400).json({ message: 'Neispravan userId' });
    }

    try {
        const tasks = await db.Taskovi.findAll({
            where: { userId },
            include: [{
                model: db.User,
                as: 'User',
                attributes: ['firstname', 'lastname'],
            }]
        });

        if (tasks.length === 0) {
            console.log(`Nema taskova za userId: ${userId}`);
            return res.status(404).json({ message: 'Nema taskova za ovog korisnika' });
        }

        console.log('Dohvaćeni taskovi:', tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Greška prilikom dohvata taskova za korisnika:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});
// Ruta za dohvaćanje radnika po sektoru
router.get('/workers', async(req, res) => {
    const { sector } = req.query;

    try {
        const workers = await db.User.findAll({
            where: { sector: sector }
        });

        if (workers.length === 0) {
            return res.status(404).json({ message: 'Nema radnika za navedeni sektor' });
        }

        res.json(workers);
    } catch (error) {
        console.error('Greška prilikom dohvata radnika:', error.message);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});

router.get('/worker-tasks', async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Izvuci token iz Authorization header-a

    if (!token) return res.status(401).json({ message: 'Pristup odbijen. Nema tokena.' });

    try {
        const decoded = jwt.verify(token, 'tajna'); // Dekodiraj token koristeći tvoju tajnu
        const userId = decoded.id; // Preuzmi ID korisnika iz tokena

        const tasks = await db.Taskovi.findAll({
            where: {
                userId: userId // Pronađi taskove vezane za prijavljenog korisnika
            }
        });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'Nema taskova za prikaz.' });
        }

        res.json(tasks);
    } catch (error) {
        console.error('Greška prilikom dohvata taskova:', error);
        res.status(500).json({ message: 'Greška na serveru' });
    }
});


module.exports = router;