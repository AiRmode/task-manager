const mongoose = require('mongoose');

const databaseName = 'task-manager';
const connectionURL = 'mongodb://127.0.0.1:27017/' + databaseName;

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});