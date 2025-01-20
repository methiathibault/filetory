const User = require('../models/user');
const nodemailer = require("nodemailer");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

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

exports.connectUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findAll({ where: { email: email, password: password }, });
        if (user){
            res.status(201).json(12345);
        }else{
            res.status(500).json({"error": "cant connect" });
        }
        
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.destroy({ where:{id : id} });
        res.status(201).json(user);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}




exports.sendmail = async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // Utilise TLS
        auth: {
          user: process.env.MAIL_USERNAME, // Remplacez par votre email Outlook
          pass: process.env.MAIL_PASSWORD // Remplacez par votre mot de passe ou un mot de passe d'application
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

    let info = await transporter.sendMail({
      from: '"Me" <d.costes@ecole-ipssi.net>',
      to: "costes.duncan@gmail.com",
      subject: "bonjour!",
      text: "hallo?",
      html: "<b>Hello le world? </b> ceci est un putain de test"
    });
    res.status(201).json({"is":"ok"});
}