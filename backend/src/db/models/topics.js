const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const topics = sequelize.define(
    'topics',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  topics.associate = (db) => {
    db.topics.belongsToMany(db.posts, {
      as: 'posts',
      foreignKey: {
        name: 'topics_postsId',
      },
      constraints: false,
      through: 'topicsPostsPosts',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.topics.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.topics.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.topics.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return topics;
};
