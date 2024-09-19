const db = require('../models');
const sendEmail = require('../services/emailService');
const { Users, Taskovi } = require('../models');
// Kreiranje novog tiketa
exports.createTicket = async(req, res) => {
    try {
        const { title, description, userId } = req.body;
        const ticket = await db.Ticket.create({
            title,
            description,
            userId
        });
        res.status(201).json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nešto je pošlo po zlu prilikom kreiranja tiketa.' });
    }
};

// Dobijanje svih tiketa
exports.getAllTickets = async(req, res) => {
    try {
        const tickets = await db.Ticket.findAll();
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nešto je pošlo po zlu prilikom dobijanja tiketa.' });
    }
};

// Ažuriranje tiketa
exports.updateTicket = async(req, res) => {
    try {
        const { title, description } = req.body;
        const ticket = await db.Ticket.findByPk(req.params.id);
        if (ticket) {
            ticket.title = title;
            ticket.description = description;
            await ticket.save();
            res.json(ticket);
        } else {
            res.status(404).json({ error: 'Ticket nije pronađen.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Nešto je pošlo po zlu prilikom ažuriranja tiketa.' });
    }
};

// Funkcija kada radnik završi task
const completeTask = async(req, res) => {
    const { taskId, userId } = req.body;

    try {
        const task = await Taskovi.findByPk(taskId);
        const radnik = await Users.findByPk(userId); // Radnik koji završava task

        if (task && radnik) {
            task.status = 'completed';
            await task.save();

            // Pronađi voditelja sektora na osnovu sektora radnika i role 'Sector Manager'
            const voditelj = await Users.findOne({ where: { role: 'Sector Manager', sector: radnik.sector } });

            if (voditelj) {
                // Slanje emaila voditelju
                const subject = `Task završen: ${task.sifra_taska}`;
                const text = `Task "${task.naziv_taska}" sa šifrom "${task.sifra_taska}" je uspješno završen.`;

                await sendEmail(voditelj.email, subject, text);

                res.status(200).json({ message: 'Task je završen i email je poslan voditelju.' });
            } else {
                res.status(404).json({ message: 'Nije pronađen voditelj za ovaj sektor.' });
            }
        } else {
            res.status(404).json({ message: 'Task ili radnik nije pronađen.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Došlo je do greške.', error });
    }
};

// Funkcija za kreiranje taska i slanje obavještenja radniku
const createTask = async(req, res) => {
    const { naziv_taska, sifra_taska, userId } = req.body;

    try {
        const task = await Taskovi.create({
            naziv_taska,
            sifra_taska,
            userId,
            status: 'pending',
        });

        // Pronađi radnika kojem je task dodijeljen
        const radnik = await Users.findByPk(userId);

        if (radnik && radnik.role === 'User') {
            // Slanje emaila radniku
            const subject = `Novi task: ${task.sifra_taska}`;
            const text = `Dobili ste novi task "${task.naziv_taska}". Molimo da se posvetite zadatku.`;

            await sendEmail(radnik.email, subject, text);

            res.status(201).json({ message: 'Task kreiran i obavještenje poslano radniku.' });
        } else {
            res.status(404).json({ message: 'Radnik nije pronađen ili nema ulogu User.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Došlo je do greške prilikom kreiranja taska.', error });
    }
};

module.exports = {
    completeTask,
    createTask,
};