const router = require('express').Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/User');
dotenv.config();


router.get('/me', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.findOne({
            email: decoded.sub
        }, async function (err, user) {
            if (err)
                res.status(500).send(err);

            res.status(200).send({name: user.name, email: user.email, date: user.date});
        });

    });
});

module.exports = router;