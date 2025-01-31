const User = require('../models/user');
const Facture = require('../models/facture');

const launch = async () => {
    await User.sync({ force: true });
    await Facture.sync({ force: true });
};

launch();