const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const path = require('path');
const jwt = require('jsonwebtoken');
const Facture = require('../models/facture');
const argon2 = require('argon2');
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
        const hash = await argon2.hash(password);
        const user = await User.create({ 
            email, 
            password: hash,
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
        try {
            console.log("Email de l'utilisateur:", user.dataValues.email);
            await sendMail(
                user.dataValues.email,
                "Bienvenue chez Filetory !",
                "Votre compte a bien été créé. Vous pouvez désormais utiliser notre service de stockage."
            );
        } catch(error){
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
        const user = await User.findAll({ where: { email: email }, });
        if (user){
            try {
                console.log(user[0].password + " "+ password)
                if (await argon2.verify(user[0].password, password)) {
                    // password match
                    console.log("dans if")
                    const token = process.env.JWT_TOKEN
                    console.log("token " + token)
                    const tokenToken = crypto.randomUUID()
                    console.log("tokenToken" + tokenToken)
                    await User.update({connectionToken:tokenToken},{where:{email:email}})
                    const payload = {
                        userId: user[0].dataValues.id,
                        mail: user[0].dataValues.email,
                        token: tokenToken
                    };
                    console.log(payload)
                    const options = {
                        expiresIn: '1h' // Le token expirera dans 1 heure
                    };
                    const myjwt = jwt.sign(payload, token, options);
                    res.status(201).json(myjwt);
                } else {
                  // password did not match
                  res.status(400).json({"error": "bad password" });
                }
              } catch (err) {
                // internal failure
                res.status(500).json({"error": "cant connect" });
              }
            



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
        const todeleteinfo = await User.findAll({
            where:{
                id:id
            }
        });
        const user = await User.destroy({ where:{id : id} });

        console.log("send notif mail to user ")
        sendMail(todeleteinfo[0].dataValues.email," filetory vous dit aurevoir!","<b>filetory vous dit aurevoir! </b> votre compte a bien été supprimer tout a bien été supprimé")
        console.log("send notif mail to admin")
        sendAdminMail(todeleteinfo[0].dataValues.email+" unsubscribe", todeleteinfo[0].dataValues.email+" has unsubscribe")
        res.status(201).json(user);
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
    
}

const sendMail = async (email, title, message) => {
    if (!email) {
        throw new Error('Email recipient is required');
    }
    
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
    
        await transporter.sendMail({
            from: `"Filetory" <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: title || 'Sans titre',
            text: message || '',
            html: `<div>${message || ''}</div>`
        });
    } catch(error) {
        console.error("Erreur d'envoi de mail:", error);
        throw error;
    }
};

const sendAdminMail = async ( title, message) => {
    try{
        const users = await User.findAll({
            where:{
                roles:"admin"
            }
        });
    
        users.forEach(async user => {
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
                  to: user.email,
                  subject: message,//"bienvenue chez filetory!",
                  text: title,//"votre compte a bien été creer",
                  html: title//"<b>bienvenue chez filetory! </b> votre compte a bien été creer tu désormais utiliser beaucoup d'espace"
                });
            }catch(error){
                console.log("error while sending mail")
            }
        });
    }catch(error){
        console.log("error while getting admins")
    }
   
    
}

exports.checkAdmin = async (req, res) => {
    let id = req.params.id
    try {
        const users = await User.findAll({
            where:{
                id:id
            }
        });

        console.log(users[0].dataValues.roles)
        if(users[0].dataValues.roles == "admin"){
            res.status(200).json({"admin":true});
        }else{
            res.status(200).json({"admin":false});
        }
        
       
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}

exports.modifUser = async (req, res) => {
    const { email, name, familyName, postalAdress, id } = req.body;
    
    try {
        const user = await User.findAll({ where: { email: email }, });
        if (user){
            try {
               
                await User.update({email:email,familyName:familyName,name:name,postalAdress:postalAdress},{where:{id:id}})
                   
              } catch (err) {
                // internal failure
                res.status(500).json({"error": "cant connect" });
              }
        }else{
            res.status(500).json({"error": "cant connect" });
        }
        
    } catch (error) {
        console.log({ "error": error });
        res.status(500).json({ message: error.message });
    }
}
