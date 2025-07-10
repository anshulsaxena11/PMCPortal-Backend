const requestIp = require('request-ip')

const getClientIp = async(req)=>{
    const ip = requestIp.getClientIp(req)

    return (ip ||req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress || req.connection?.remoteAddress ||null);
}

module.exports = getClientIp;