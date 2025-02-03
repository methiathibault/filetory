const jwt = require('jsonwebtoken')
const User = require('../models/user');

exports.authenticate =  async(req,res,next) => {
    const token = req.query.token ? req.query.token : req.headers.authorization
    
    console.log("token")
    console.log(token)
    if (token  && process.env.JWT_TOKEN){
        jwt.verify(token, process.env.JWT_TOKEN, async (err,decoded)=>{
            if(err){
                res.status(401).json({error : "Access denied verify"})
            } else {
                console.log("decoded ")
                console.log(decoded.token)
                const users = await User.findAll({
                    where:{
                        connectionToken:decoded.token
                    }
                });
                console.log(users)
                next()
            }
        })
    }else{
        res.status(401).json({error : "Access denied"})
    }
}