require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require('./routes/user');

//Load env variables
const mongo_URI = process.env.MONGO_URI;
const origin = process.env.REQ_ORIGIN || 'http://localhost:3000';

//DB Connection
mongoose.connect(mongo_URI)
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

//Middleware
app.use(cors({ credentials: true, origin: origin }));
app.use(express.json());

//Routes
app.use('/users', userRoutes);

app.use('/', (req, res) => {
    res.send('User Auth system');
})

const port = process.env.port || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})