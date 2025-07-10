const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    const token = req.cookies?.token
    if(!token){
        return res.status(401).json({
            statuscode:401,
            message:"Unauthorized"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded
        next();
    }catch(error){
        return res.status(401).json({
            statusCode:401,
            message:'unauthorized'
        })
    }
}

module.exports = authMiddleware;