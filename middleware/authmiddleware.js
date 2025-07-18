const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    const sessionToken = req.session?.user?.token;

    const cookieToken  = req.cookies?.token
    const token = sessionToken || cookieToken;
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