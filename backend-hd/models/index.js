const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Kreiranje Sequelize instance sa konfiguracijom
const sequelize = new Sequelize(config.database, config.username, config.password, config);


// Čitanje svih fajlova u models folderu i njihovo učitavanje
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); // Učitavanje modela
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db); // Pozivanje asocijacija modela
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; // Eksportovanje db objekta sa svim modelima i Sequelize instancom