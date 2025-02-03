const Facture = require('../models/facture');
const User = require('../models/user');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const STORAGE_PER_PURCHASE = 21474836480;

exports.getFactures = async (req, res) => {
    try {
        const users = await Facture.findAll();
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.getFacture = async (req, res) => {
    let id = req.params.id
    try {
        const users = await Facture.findAll({
            where:{
                id:id
            }
        });
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.getFactureByUserId = async (req, res) => {
    let id = req.params.id
    try {
        const users = await Facture.findAll({
            where:{
                factureUserId:id
            }
        });
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.newFacture = async (req, res) => {
    console.log(req.body)
    const { userId, userEmail } = req.body;
    try {
        const facture = await Facture.create({ 
            "factureUserId": userId, 
            "email": userEmail,
            "dateBill": new Date(),
            "unitPrice": 20.0, 
            "tva": 5.0, 
            "quantity": 1, 
            "totalPrice": 20.0  
        });

        const user = await User.findByPk(userId);
        if (user) {
            const currentStorage = Number(user.totalStorage);
            const newStorage = currentStorage + STORAGE_PER_PURCHASE;

            if (newStorage <= Number.MAX_SAFE_INTEGER) {
                user.totalStorage = newStorage;
                await user.save();
            } else {
                throw new Error('Storage limit would exceed maximum allowed value');
            }
        }

        res.status(201).json(facture);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.deleteFacture = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await Facture.destroy({ where:{id : id} });
        res.status(201).json(user);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}