module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'role', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'User',
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'role');
    },
};