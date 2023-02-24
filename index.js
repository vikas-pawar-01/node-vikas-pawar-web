require('dotenv').config();

const express = require("express");
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const featuresRoute = require('./routes/features-route');
const userRoute = require('./routes/user-route');
const usersRoute = require('./routes/users-route');
const Todo = require('./models/todo');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/features', featuresRoute);
app.use('/api/user', userRoute);
app.use('/api/users', usersRoute);

app.get('/close', () => {
    console.log("Exiting NodeJS server");
    process.exit();
});

app.get('/api/todos', async (req, res, next) => {
    let todos;
    try {
        todos = await Todo.find({});
    } catch (err) {
        const error = new Error({
            message: 'Something went wrong, could not retrive users.',
            coed: 500
        });

        return next(error);
    }


    if (!todos || todos.length === 0) {
        const error = new Error({
            message: 'No todos.',
            code: 200
        });
        return next(error);
    }

    res.json({ todos: todos.map(todo => todo.toObject({ getters: true })) });
});

app.post('/api/todo', async (req, res, next) => {
    const { name } = req.body;

    const createdTodo = new Todo({
        name
    });

    try {
        await createdTodo.save();
    } catch(err){
        const error = new Error({
            message: 'Add todo failed, please try again later.',
            code: 500
        });
        return next(error);
    }

    res.status(201).json({
        todoId: createdTodo.id,
    });
});

app.use(express.static(path.join(__dirname, 'build'), { index: false }));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    });
});

mongoose.set("strictQuery", false);
mongoose
    .connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.6xmi5b5.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`)
    .then(() => {

        let listener = app.listen(process.env.PORT, (err) => {
            if (err) {
                console.log(err);
                res.send({ status: 500, data: { message: err } });
            }
            console.log(`App connected to PORT: ${listener.address().port}`);
        });

        console.log('MongoDB connected successfully!');
    })
    .catch((err) => {

        console.log(err);
        console.log('MongoDB NOT connected!!!');

        let listener = app.listen(process.env.PORT, (err) => {
            if (err) {
                console.log(err);
                res.send({ status: 500, data: { message: err } });
            }
            console.log(`App connected to PORT: ${listener.address().port}`);
        });        
    });
