const { parseAuthorization } = require('../utils/authorization');

module.exports = function (req, res, next) {
    const authorization = parseAuthorization(req.headers);
    if (!authorization.firstName || !authorization.lastName || !authorization.userId) {
        res.status(401).json({error: "Not logged in!"});
    } else {
        return next();
    }
}