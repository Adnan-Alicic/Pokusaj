const db = require('./models');

async function updateAdminRole() {
    try {
        const [affectedRows] = await db.User.update({ role: 'Admin' }, { where: { email: 'admin@sagas.ba' } });

        if (affectedRows === 0) {
            console.log('Nijedan red nije ažuriran. Proverite da li korisnik sa emailom admin@sagas.ba postoji.');
        } else {
            console.log(`Rola za admin korisnika je uspešno ažurirana. Ažurirano je ${affectedRows} redova.`);
        }
    } catch (error) {
        console.error('Greška prilikom ažuriranja role za admin korisnika:', error);
    }
}

updateAdminRole();