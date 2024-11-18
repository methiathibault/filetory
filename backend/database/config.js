const User = require('../models/user');

const launch = async () => {
    await User.sync({ force: true });
};

launch();