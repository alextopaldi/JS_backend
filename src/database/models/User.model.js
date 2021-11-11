const Sequelize = require('sequelize');
const { sequelize } = require('..');


class User extends Sequelize.Model {}

User.init(
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4
        },
        login: {
            type: Sequelize.STRING,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        name: {
            type: Sequelize.STRING,
            defaultValue: false,
        },
    },

    { sequelize: sequelize, underscored: true, modelName: 'user' }
);


const ToDo = require('./ToDo.model');
const Token = require('./Token.model');
User.hasMany(ToDo);
User.hasMany(Token);
Token.belongsTo(User, {
    foreignKey: 'userId'
});
ToDo.belongsTo(User, {
    foreignKey: 'userId'
});
module.exports = User