const db = require('./models');

async function updateRoles() {
    const roleUpdates = [
        { email: 'sector1manager@example.com', role: 'Sector Manager' },
        { email: 'sector2manager@example.com', role: 'Sector Manager' },
        { email: 'sector3manager@example.com', role: 'Sector Manager' },
        { email: 'sector4manager@example.com', role: 'Sector Manager' },
        { email: 'worker1@example.com', role: 'User' },
        { email: 'worker2@example.com', role: 'User' },
        { email: 'worker3@example.com', role: 'User' },
        { email: 'worker4@example.com', role: 'User' },
        { email: 'worker5@example.com', role: 'User' },
        { email: 'worker6@example.com', role: 'User' },
        { email: 'worker7@example.com', role: 'User' },
        { email: 'worker8@example.com', role: 'User' },
    ];

    for (let update of roleUpdates) {
        try {
            await db.User.update({ role: update.role }, { where: { email: update.email } });
            console.log(`Rola za korisnika sa emailom ${update.email} je uspešno ažurirana na ${update.role}.`);
        } catch (error) {
            console.error(`Greška prilikom ažuriranja role za korisnika sa emailom ${update.email}:`, error);
        }
    }
}

updateRoles();