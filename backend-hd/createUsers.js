const bcrypt = require('bcryptjs');
const db = require('./models');

async function createUsers() {
    const users = [
        { firstname: 'Sector', lastname: 'Manager1', email: 'sector1manager@example.com', role: 'Sector Manager', password: 'password1' },
        { firstname: 'Sector', lastname: 'Manager2', email: 'sector2manager@example.com', role: 'Sector Manager', password: 'password2' },
        { firstname: 'Sector', lastname: 'Manager3', email: 'sector3manager@example.com', role: 'Sector Manager', password: 'password3' },
        { firstname: 'Sector', lastname: 'Manager4', email: 'sector4manager@example.com', role: 'Sector Manager', password: 'password4' },
        { firstname: 'Worker', lastname: 'One', email: 'worker1@example.com', role: 'User', password: 'password1' },
        { firstname: 'Worker', lastname: 'Two', email: 'worker2@example.com', role: 'User', password: 'password2' },
        { firstname: 'Worker', lastname: 'Three', email: 'worker3@example.com', role: 'User', password: 'password3' },
        { firstname: 'Worker', lastname: 'Four', email: 'worker4@example.com', role: 'User', password: 'password4' },
        { firstname: 'Worker', lastname: 'Five', email: 'worker5@example.com', role: 'User', password: 'password5' },
        { firstname: 'Worker', lastname: 'Six', email: 'worker6@example.com', role: 'User', password: 'password6' },
        { firstname: 'Worker', lastname: 'Seven', email: 'worker7@example.com', role: 'User', password: 'password7' },
        { firstname: 'Worker', lastname: 'Eight', email: 'worker8@example.com', role: 'User', password: 'password8' },
    ];

    for (let user of users) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password, salt);

        await db.User.create({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: hashedPassword,
            role: user.role,
            salt: salt,
        });
    }

    console.log('Korisnici su uspješno kreirani.');
}

createUsers();