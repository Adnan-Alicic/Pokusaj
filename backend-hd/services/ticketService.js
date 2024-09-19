const db = require('../models');

// Kreiranje novog tiketa
exports.createTicket = async(ticketData) => {
    return await db.Ticket.create(ticketData);
};

// Dobijanje svih tiketa
exports.getAllTickets = async() => {
    return await db.Ticket.findAll();
};

// Ažuriranje tiketa
exports.updateTicket = async(id, updateData) => {
    const ticket = await db.Ticket.findByPk(id);
    if (ticket) {
        return await ticket.update(updateData);
    }
    return null; // Ako ticket nije pronađen, vraća null
};