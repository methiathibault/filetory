const File = require('../models/file');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = '/app/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = async (req, file, cb) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            cb(new Error('User not found'));
            return;
        }

        const existingFiles = req.files || [];
        const totalUploadSize = existingFiles.reduce((acc, f) => parseInt(acc) + parseInt(f.size), 0) + parseInt(file.size);

        if (parseInt(user.usedStorage) + parseInt(totalUploadSize) > parseInt(user.totalStorage)) {
            cb(new Error('Storage limit would be exceeded'));
            return;
        }

        cb(null, true);
    } catch (error) {
        cb(error);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

exports.uploadFiles = [upload.array('files'), async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);
        const userId = decoded.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const totalUploadSize = req.files.reduce((acc, file) => parseInt(acc) + parseInt(file.size), 0);

        const newTotalUsed = parseInt(user.usedStorage) + parseInt(totalUploadSize);
        if (newTotalUsed > parseInt(user.totalStorage)) {
            req.files.forEach(file => fs.unlinkSync(file.path));
            return res.status(400).json({ message: 'Storage limit would be exceeded' });
        }

        const savedFiles = [];
        for (const file of req.files) {
            const fileType = path.extname(file.originalname).toLowerCase();
            let type = 'other';
            if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileType)) {
                type = 'image';
            } else if (['.pdf', '.doc', '.docx', '.txt'].includes(fileType)) {
                type = 'document';
            }

            const savedFile = await File.create({
                name: file.originalname,
                path: file.path,
                type: type,
                size: parseInt(file.size),
                userId: userId
            });
            savedFiles.push(savedFile);
        }

        user.usedStorage = newTotalUsed;
        await user.save();

        res.status(201).json(savedFiles);
    } catch (error) {
        console.error('Error uploading files:', error);
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        res.status(500).json({ message: error.message });
    }
}];

exports.getFiles = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);
        const files = await File.findAll({
            where: {
                userId: decoded.userId
            },
            order: [['uploadDate', 'DESC']]
        });
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getStorageInfo = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const usedStorage = parseInt(user.usedStorage) || 0;
        const totalStorage = parseInt(user.totalStorage) || 0;

        res.status(200).json({
            usedStorage: usedStorage,
            totalStorage: totalStorage,
            availableStorage: totalStorage - usedStorage
        });
    } catch (error) {
        console.error('Error fetching storage info:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);
        
        const file = await File.findOne({
            where: {
                id: req.params.id,
                userId: decoded.userId
            }
        });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.resolve(file.path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(filePath, file.name);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_TOKEN);
        
        const user = await User.findByPk(decoded.userId);
        const file = await File.findOne({
            where: {
                id: req.params.id,
                userId: decoded.userId
            }
        });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.resolve(file.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        if (user) {
            const currentStorage = parseInt(user.usedStorage) || 0;
            const fileSize = parseInt(file.size) || 0;
            user.usedStorage = Math.max(0, currentStorage - fileSize);
            await user.save();
        }

        await file.destroy();
        
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: error.message });
    }
};