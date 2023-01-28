const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { getPlayerId } = require('../services/database');

function titleCase(str) {
    if ((str === null) || (str === '')) {
        return false;
    } else {
        str = str.toString();
        str = str.trim();
    }

    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function sanitizeNameString(name) {
    name = name.toString();
    name = name.trim();        
    return name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

//let id = 1;

router.post('/', function (req, res) {
    check('firstName', 'Invalid First Name').trim().matches("^[ a-zA-z0-9]{2,16}$");
    check('lastName', 'Invalid Last Name').trim().matches("^[ a-zA-z0-9]{2,16}$");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors.array();
        res.redirect(`/login`);
    } else {
        const firstName = sanitizeNameString(req.body.firstName);
        const lastName = sanitizeNameString(req.body.lastName);
        getPlayerId(firstName, lastName, (err, result) => {
            if (err) {
                res.redirect(`/login`);
            } else {
                res.json({
                    firstName: firstName,
                    lastName: lastName,
                    userId: result
                });
            }
        });

        /*
        const userId = id;
        id += 1;
     
        res.json({
            firstName: firstName,
            lastName: lastName,
            userId: userId
        });
        */
    }
});

module.exports = router;
