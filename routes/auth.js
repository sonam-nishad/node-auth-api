const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.post('/register', async (req, res) => {

    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) return res.status(400).send('email already exist');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const saveUser = await user.save();
        res.send(saveUser);
    } catch (err) {
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    console.log('login called');

    User.findOne({
        email: req.body.email
    }, async function (err, user) {

        console.log('user', user);
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword)
                res.status(400).send({ success: false, msg: 'Email or Password if not valid' });
            else {
                const token = jwt.sign({sub: req.body.email}, process.env.SECRET, {expiresIn: '7d'});
                res.send({ success: true, token: token, msg: 'Successfully logged in' });

            }
        }
    });
})

module.exports = router;