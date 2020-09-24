"use strict";
module.exports = {
    development: {
        host: 'localhost',
        port: 5432,
        username: 'greenthumb_api',
        password: 'ah0rseisCORRECT!',
        database: 'greenthumb',
        dialect: 'postgres',
        logging: false,
        sync: {
            force: false,
            logging: false,
            alter: false,
        },
        define: {
            underscored: true,
        },
        timezone: 'UTC',
    },
};
