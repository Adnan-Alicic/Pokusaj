module.exports = (sequelize, DataTypes) => {
    const Taskovi = sequelize.define('Taskovi', {
        sifra_taska: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        naziv_taska: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tekst_taska: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        prioritet: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sector: { // Dodajemo novo polje za sektor
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
            allowNull: false,
        },
        verifikacija: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Pretpostavljamo da task nije verifikovan na početku
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        }
    }, {
        tableName: 'Taskovi',
        freezeTableName: true, // Sprječava Sequelize da mijenja ime tabele
        timestamps: true, // Automatski će raditi sa `createdAt` i `updatedAt` kolonama

    });

    Taskovi.associate = function(models) {
        Taskovi.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    };

    return Taskovi;
};