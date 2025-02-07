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
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getUser = async (req, res) => {
    let id = req.params.id
    const pattern = /^\d+$/;
    if (!pattern.test(id)){
        res.status(400).json({ message: "wrong id format" });
    }
    try {
        const users = await User.findAll({
            where:{
                id:id
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createUser = async (req, res) => {
    const { email, password, name, familyName, postalAdress } = req.body;

    const patternPostal = /^\d+$/;
    const patternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const patternName = /^[a-zA-ZÀ-ÿ-_ ]+$/;
    const patternPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$/;
    if (!patternPostal.test(postalAdress)){
        res.status(400).json({ message: "wrong postall adress format" });
    }
    if (!patternEmail.test(email)){
        res.status(400).json({ message: "wrong email format" });
    }
    if (!patternName.test(name)){
        res.status(400).json({ message: "wrong name format" });
    }
    if (!patternName.test(familyName)){
        res.status(400).json({ message: "wrong family format" });
    }
    if (!patternPassword.test(password)){
        res.status(400).json({ message: "wrong password format" });
    }




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
        res.status(500).json({ message: error.message });
    }
}

exports.connectUser = async (req, res) => {
    const { email, password } = req.body;

    const patternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const patternPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$/;
    if (!patternEmail.test(email)){
        res.status(400).json({ message: "wrong email format" });
    }

    if (!patternPassword.test(password)){
        res.status(400).json({ message: "wrong password format" });
    }

    try {
        const user = await User.findAll({ where: { email: email }, });
        if (user){
            try {
                if (await argon2.verify(user[0].password, password)) {
                    const token = process.env.JWT_TOKEN
                    const tokenToken = crypto.randomUUID()
                    await User.update({connectionToken:tokenToken},{where:{email:email}})
                    const payload = {
                        userId: user[0].dataValues.id,
                        mail: user[0].dataValues.email,
                        token: tokenToken
                    };
                    const options = {
                        expiresIn: '1h'
                    };
                    const myjwt = jwt.sign(payload, token, options);
                    res.status(201).json(myjwt);
                } else {
                  res.status(400).json({"error": "bad password" });
                }
              } catch (err) {
                res.status(500).json({"error": "cant connect" });
              }
        }else{
            res.status(500).json({"error": "cant connect" });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    let id = req.params.id

    const pattern = /^\d+$/;
    if (!pattern.test(id)){
        res.status(400).json({ message: "wrong id format" });
    }

    try {
        const todeleteinfo = await User.findAll({
            where:{
                id:id
            }
        });
        const user = await User.destroy({ where:{id : id} });

        sendMail(todeleteinfo[0].dataValues.email," filetory vous dit aurevoir!","<b>filetory vous dit aurevoir! </b> votre compte a bien été supprimer tout a bien été supprimé")
        sendAdminMail(todeleteinfo[0].dataValues.email+" unsubscribe", todeleteinfo[0].dataValues.email+" has unsubscribe")
        res.status(201).json(user);
    } catch (error) {
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
                    secure: false,
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
                  subject: message,
                  text: title,
                  html: title
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

    const pattern = /^\d+$/;
    if (!pattern.test(id)){
        res.status(400).json({ message: "wrong id format" });
    }

    try {
        const users = await User.findAll({
            where:{
                id:id
            }
        });

        if(users[0].dataValues.roles == "admin"){
            res.status(200).json({"admin":true});
        }else{
            res.status(200).json({"admin":false});
        }
        
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.modifUser = async (req, res) => {
    const { email, name, familyName, postalAdress, id } = req.body;
    const patternid = /^\d+$/;
    const patternPostal = /^\d+$/;
    const patternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const patternName = /^[a-zA-ZÀ-ÿ-_ ]+$/;
   
    if (!patternPostal.test(postalAdress)){
        res.status(400).json({ message: "wrong postall adress format" });
    }
    if (!patternEmail.test(email)){
        res.status(400).json({ message: "wrong email format" });
    }
    if (!patternName.test(name)){
        res.status(400).json({ message: "wrong name format" });
    }
    if (!patternName.test(familyName)){
        res.status(400).json({ message: "wrong family format" });
    }
    if (!patternid.test(id)){
        res.status(400).json({ message: "wrong id format" });
    }
    try {
        const user = await User.findAll({ where: { email: email }, });
        if (user){
            try {
               
                await User.update({email:email,familyName:familyName,name:name,postalAdress:postalAdress},{where:{id:id}})
                   
              } catch (err) {
                res.status(500).json({"error": "cant connect" });
              }
        }else{
            res.status(500).json({"error": "cant connect" });
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
