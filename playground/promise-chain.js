require('../src/db/mongoose');
const User = require('../src/models/user');

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count;
};

const user = updateAgeAndCount('5d603af793abd418a8d9dd1b', 2).then(count => {
    console.log('count: ' + count);
}).catch(e => {
    console.log(e);
});

/*
const user = User.findByIdAndUpdate('5d603af793abd418a8d9dd1b', {age: 1}).then(result => {
    console.log(result);
    return User.countDocuments({age: 1});
}).then(res => {
    console.log(res);
}).catch(e => {
    console.log(e);
});*/
