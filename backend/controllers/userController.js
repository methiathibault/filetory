const User = require('../models/user');
const nodemailer = require("nodemailer");
const path = require('path');
const jwt = require('jsonwebtoken');
const Facture = require('../models/facture');
const INITIAL_STORAGE = 21474836480;
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.getUser = async (req, res) => {
    let id = req.params.id
    try {
        const users = await User.findAll({
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

exports.createUser = async (req, res) => {
    console.log(req.body)
    const { email, password, name, familyName, postalAdress } = req.body;
    try {
        const user = await User.create({ 
            email, 
            password,
            name,
            familyName, 
            postalAdress,
            usedStorage: 0,
            totalStorage: INITIAL_STORAGE
        });
        console.log(user)
        const _ = await Facture.create({ 
            "factureUserId": user.dataValues.id, 
            "email": user.dataValues.email,
            "dateBill": new Date(),
            "unitPrice": 20.0, 
            "tva": 5.0, 
            "quantity": 1, 
            "totalPrice": 20.0  
        });
        try{
            sendConfimationMail(user.dataValues.email)
        }catch(error){
            res.status(500).json({"error":"error mail sending"})
        }
        
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
            const token = process.env.JWT_TOKEN
            
            const payload = {
                userId: user[0].dataValues.id,
                mail: user[0].dataValues.email,
                token: 12345
            };
            console.log(payload)
            const options = {
                expiresIn: '1h' // Le token expirera dans 1 heure
            };
            const myjwt = jwt.sign(payload, token, options);
            res.status(201).json(myjwt);
        }else{
            res.status(500).json({"error": "cant connect" });
        }
        
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    let id = req.params.id
    console.log("id "+id)
    try {
        const user = await User.destroy({ where:{id : id} });

        console.log("send notif mail to user")
        console.log("send notif mail to admin")
        res.status(201).json(user);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

const sendConfimationMail = async (email) => {
    try{
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
          from: '"Me" '+process.env.MAIL_USERNAME,
          to: email,
          subject: "bienvenue chez filetory!",
          text: "votre compte a bien été creer",
          html: "<b>bienvenue chez filetory! </b> votre compte a bien été creer tu désormais beaucoup d'espace"
        });
    }catch(error){
        console.log("error while sending mail")
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