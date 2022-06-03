require('dotenv').config();

const express = require("express");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const userRoute = require('./routes/user-route');
const usersRoute = require('./routes/users-route');
const usersScript = require('./routes/users-script-route');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'build'), { index: false }));

app.use('/api/user', userRoute);
app.use('/api/users', usersRoute);
app.use('/api/cron', usersScript);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    });
})

mongoose
    .connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.enkvh.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`)
    .then(() => {

        app.listen(process.env.PORT, (err) => {
            if (err) {
                console.log(err);
                res.send({ status: 500, data: { message: err } });
            }
            console.log(`App connected to PORT: ${process.env.PORT}`);
        });

        console.log('MongoDB connected successfully!');
    })
    .catch((err) => {
        console.log(err);
    });
