import requestIp from 'request-ip';
import geoip from 'geoip-lite';

const ipMiddleware = (req, res, next) => {
    let clientIp = requestIp.getClientIp(req);

    if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
        clientIp = '127.0.0.1';
    }

    const geo = geoip.lookup(clientIp);

    req.clientIp = clientIp;
    req.geo = geo;

    next();
};

export default ipMiddleware;