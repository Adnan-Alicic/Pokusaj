require('dotenv').config(); // Učitaj varijable iz .env fajla

module.exports = {
    username: process.env.DB_USERNAME || 'postgres', // Ako nema varijable u okruženju, koristi lokalne postavke
    password: process.env.DB_PASSWORD || 'adminadmin',
    database: process.env.DB_NAME || 'SaGas',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432
};