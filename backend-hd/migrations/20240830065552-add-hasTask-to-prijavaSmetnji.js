module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('PrijavaSmetnji', 'hasTask', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('PrijavaSmetnji', 'hasTask');
    }
};