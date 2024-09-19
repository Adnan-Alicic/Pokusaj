const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');

function initialize(passport) {
    const authenticateUser = async(email, password, done) => {
        try {
            console.log(`Pokušaj prijave za email: ${email}`); // Log za početak autentifikacije

            const user = await db.User.findOne({ where: { email } });

            if (!user) {
                console.log('Korisnik nije pronađen'); // Log ako korisnik nije pronađen
                return done(null, false, { message: 'Nema korisnika sa ovim emailom.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Pogrešna lozinka'); // Log ako lozinka nije ispravna
                return done(null, false, { message: 'Pogrešna lozinka.' });
            }

            console.log('Prijava uspješna'); // Log ako je prijava uspješna
            return done(null, user);
        } catch (err) {
            console.error('Greška prilikom autentifikacije:', err); // Log za bilo koju grešku
            return done(err);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => done(null, { id: user.id, role: user.role }));
    passport.deserializeUser(async(id, done) => {
        try {
            const user = await db.User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initialize;