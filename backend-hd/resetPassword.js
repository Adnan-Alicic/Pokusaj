const bcrypt = require('bcryptjs');
const db = require('./models');

async function resetPassword() {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('adminadmin', salt);

    await db.User.update({ password: hashedPassword, salt: salt }, { where: { email: 'admin@sagas.ba' } });

    console.log('Lozinka je uspješno resetovana.');
}

resetPassword();