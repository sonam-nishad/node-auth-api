const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//connct to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    () => console.log('connected to db')
);

app.use(express.json());

// import router
const authRouter = require('./routes/auth');
const infoRouter = require('./routes/info');

app.use('/api/user', authRouter);
app.use('/api/', infoRouter);

app.listen(3003, () => {
    console.log('server up and running on port 3003');
})