const mongoose = require('mongoose');

const databaseName = process.env.MONGO_DB_NAME;
const connectionURL = process.env.MONGO_URL + databaseName;

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});