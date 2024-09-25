module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('Taskovi', 'sector', {
            type: Sequelize.STRING,
            allowNull: false, // NOT NULL ograničenje
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Taskovi', 'sector');
    }
};