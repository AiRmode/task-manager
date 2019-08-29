const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server listens port: ' + port);
});

// const Task = require('./models/task');
// const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('5d66bb33a2c40f21ad6a4538');
    // await task.populate('owner').execPopulate();

    // const user = await User.findById('5d66948a8fc1fb205241afb9');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);
};

main();