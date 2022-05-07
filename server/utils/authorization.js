module.exports.parseAuthorization = function (headers) {
    const authorizationHeader = headers.authorization || "";
    const token = authorizationHeader.split(/\s+/).pop() || "";
    const authorization = Buffer.from(token, 'base64').toString();
    const [firstName, lastName, userId] = authorization.split(/:/);
    return {
        firstName,
        lastName,
        userId
    };
}