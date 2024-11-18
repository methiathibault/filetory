const User = require('../models/user');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.createUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        res.status(201).json(user);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}