const User = require('../models/user');
const Facture = require('../models/facture');
const File = require('../models/file');

const launch = async () => {
    await User.sync({ force: true });
    await Facture.sync({ force: true });
    await File.sync({ force: true });
};

launch();