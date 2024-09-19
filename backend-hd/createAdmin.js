const bcrypt = require('bcryptjs');
const db = require('./models');

async function createAdmin() {
    const adminData = {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@sagas.ba',
        password: 'adminadmin',
        useraccess: 2, // 2: Admin
    };

    const salt = bcrypt.genSaltSync(10);
    adminData.password = bcrypt.hashSync(adminData.password, salt);

    try {
        await db.User.create(adminData);
        console.log('Admin korisnik je uspješno kreiran.');
    } catch (error) {
        console.error('Greška prilikom kreiranja admin korisnika:', error);
    }
}

createAdmin();