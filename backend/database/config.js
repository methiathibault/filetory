const User = require('../models/user');
const Facture = require('../models/facture');
const File = require('../models/file');
const path = require('path');
const argon2 = require('argon2');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const launch = async () => {
    const hash = await argon2.hash(process.env.ADMIN_PASSWORD);
    await User.sync({ force: true });
    await Facture.sync({ force: true });
    await File.sync({ force: true });
    await User.create({
        email: process.env.ADMIN_EMAIL,
        password: hash,
        name: 'Admin',
        familyName: 'Admin',
        postalAdress: 12345,
        roles: 'admin',
    });
};

launch();