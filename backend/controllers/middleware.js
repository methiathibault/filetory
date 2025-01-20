exports.authenticate =  async(req,res,next) => {
    const token = req.query.token ? req.query.token : req.headers.authorization
    console.log(token)
    if (token){
        next()
    }else{
        res.status(401).json({error : "Access denied"})
    }
}