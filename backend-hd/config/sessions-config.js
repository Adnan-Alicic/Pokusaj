const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // Koristimo PostgreSQL za čuvanje sesija

// Konfiguracija za povezivanje sa PostgreSQL bazom podataka
const sessionStore = new pgSession({
    conString: 'postgresql://postgres:adminadmin@localhost:5432/SaGas', // Podaci za povezivanje sa bazom
    tableName: 'session' // Ime tabele u kojoj će se čuvati sesije
});

// Postavljanje Express sesija sa PostgreSQL store-om
module.exports = function(app) {
    app.use(session({
        store: sessionStore,
        secret: 'tajnaRečZaSesiju', // Tajna reč za enkripciju sesija
        resave: false, // Ne obnavlja sesiju ako nema promena
        saveUninitialized: false, // Ne čuva prazne sesije
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 5 // Sesija traje 5 dana
        }
    }));
};