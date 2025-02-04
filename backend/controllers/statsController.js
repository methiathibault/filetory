const File = require('../models/file');
const User = require('../models/user');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

exports.getStats = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);

        const user = await User.findByPk(decoded.userId);
        if (!user || user.roles !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const totalFiles = await File.count();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayFiles = await File.count({
            where: {
                uploadDate: {
                    [Op.gte]: today
                }
            }
        });

        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
            include: [{
                model: File,
                attributes: []
            }]
        });

        const filesPerUser = await Promise.all(
            users.map(async (user) => {
                const count = await File.count({
                    where: { userId: user.id }
                });
                return {
                    id: user.id,
                    name: user.name || user.email.split('@')[0], // Utilise le nom ou le début de l'email
                    files: count
                };
            })
        );

        res.status(200).json({
            totalFiles,
            todayFiles,
            filesPerUser
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: error.message });
    }
};