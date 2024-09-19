module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('Taskovi', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            sifra_taska: {
                type: Sequelize.STRING
            },
            naziv_taska: {
                type: Sequelize.STRING
            },
            tekst_taska: {
                type: Sequelize.TEXT
            },
            prioritet: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('Taskovi');
    }
};