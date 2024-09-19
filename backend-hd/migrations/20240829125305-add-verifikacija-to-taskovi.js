module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('Taskovi', 'verifikacija', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Taskovi', 'verifikacija');
    }
};