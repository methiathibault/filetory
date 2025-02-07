const jwt = require('jsonwebtoken')
const User = require('../models/user');

exports.authenticate =  async(req,res,next) => {
    const token = req.query.token ? req.query.token : req.headers.authorization
    
    if (token  && process.env.JWT_TOKEN){
        jwt.verify(token, process.env.JWT_TOKEN, async (err,decoded)=>{
            if(err){
                res.status(401).json({error : "Access denied verify"})
            } else {
                const users = await User.findAll({
                    where:{
                        connectionToken:decoded.token
                    }
                });
                next()
            }
        })
    }else{
        res.status(401).json({error : "Access denied"})
    }
}