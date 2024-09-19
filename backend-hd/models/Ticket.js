"use strict";

module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define("Ticket", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            }
        }
    });

    Ticket.associate = function(models) {
        Ticket.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Ticket;
};