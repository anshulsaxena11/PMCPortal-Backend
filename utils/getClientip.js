const requestIp = require('request-ip');

const getClientIp = async (req) => {
  let ip = requestIp.getClientIp(req);

  // Normalize IPv6 loopback
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  return ip;
};

module.exports = getClientIp;