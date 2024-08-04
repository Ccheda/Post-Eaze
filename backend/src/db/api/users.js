const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const bcrypt = require('bcrypt');
const config = require('../../config');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class UsersDBApi {
  static async create(data, globalAccess, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.create(
      {
        id: data.data.id || undefined,

        name: data.data.name || null,
        importHash: data.data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await users.setUser(data.data.user || null, {
      transaction,
    });

    return users;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const usersData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const users = await db.users.bulkCreate(usersData, { transaction });

    // For each item created, replace relation files

    return users;
  }

  static async update(id, data, globalAccess, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, {}, { transaction });

    if (!data?.app_role) {
      data.app_role = users?.app_role?.id;
    }
    if (!data?.custom_permissions) {
      data.custom_permissions = users?.custom_permissions?.map(
        (item) => item.id,
      );
    }

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, config.bcrypt.saltRounds);
    } else {
      data.password = users.password;
    }

    await users.update(
      {
        name: data.name || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await users.setUser(data.user || null, {
      transaction,
    });

    return users;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of users) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of users) {
        await record.destroy({ transaction });
      }
    });

    return users;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, options);

    await users.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await users.destroy({
      transaction,
    });

    return users;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findOne({ where }, { transaction });

    if (!users) {
      return users;
    }

    const output = users.get({ plain: true });

    output.posts_user = await users.getPosts_user({
      transaction,
    });

    output.subscriptions_user = await users.getSubscriptions_user({
      transaction,
    });

    output.topics_user = await users.getTopics_user({
      transaction,
    });

    output.user = await users.getUser({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'user',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('users', 'name', filter.name),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.users.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.users.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('users', 'name', query),
        ],
      };
    }

    const records = await db.users.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }

  static async createFromAuth(data, options) {
    const transaction = (options && options.transaction) || undefined;
    const users = await db.users.create(
      {
        email: data.email,
        firstName: data.firstName,
        authenticationUid: data.authenticationUid,
        password: data.password,

        organizationId: data.organizationId,
      },
      { transaction },
    );

    const app_role = await db.roles.findOne({
      where: { name: 'User' },
    });
    if (app_role?.id) {
      await users.setApp_role(app_role?.id || null, {
        transaction,
      });
    }

    await users.update(
      {
        authenticationUid: users.id,
      },
      { transaction },
    );

    delete users.password;
    return users;
  }

  static async updatePassword(id, password, options) {
    const currentUser = (options && options.currentUser) || { id: null };

    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, {
      transaction,
    });

    await users.update(
      {
        password,
        authenticationUid: id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return users;
  }

  static async generateEmailVerificationToken(email, options) {
    return this._generateToken(
      ['emailVerificationToken', 'emailVerificationTokenExpiresAt'],
      email,
      options,
    );
  }

  static async generatePasswordResetToken(email, options) {
    return this._generateToken(
      ['passwordResetToken', 'passwordResetTokenExpiresAt'],
      email,
      options,
    );
  }

  static async findByPasswordResetToken(token, options) {
    const transaction = (options && options.transaction) || undefined;

    return db.users.findOne(
      {
        where: {
          passwordResetToken: token,
          passwordResetTokenExpiresAt: {
            [db.Sequelize.Op.gt]: Date.now(),
          },
        },
      },
      { transaction },
    );
  }

  static async findByEmailVerificationToken(token, options) {
    const transaction = (options && options.transaction) || undefined;
    return db.users.findOne(
      {
        where: {
          emailVerificationToken: token,
          emailVerificationTokenExpiresAt: {
            [db.Sequelize.Op.gt]: Date.now(),
          },
        },
      },
      { transaction },
    );
  }

  static async markEmailVerified(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const users = await db.users.findByPk(id, {
      transaction,
    });

    await users.update(
      {
        emailVerified: true,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return true;
  }

  static async _generateToken(keyNames, email, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const users = await db.users.findOne(
      {
        where: { email: email.toLowerCase() },
      },
      {
        transaction,
      },
    );

    const token = crypto.randomBytes(20).toString('hex');
    const tokenExpiresAt = Date.now() + 360000;

    if (users) {
      await users.update(
        {
          [keyNames[0]]: token,
          [keyNames[1]]: tokenExpiresAt,
          updatedById: currentUser.id,
        },
        { transaction },
      );
    }

    return token;
  }
};
