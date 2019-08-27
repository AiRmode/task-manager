require('../src/db/mongoose');
const Task = require('../src/models/task');

const findAndDelete = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const countDocuments = await Task.countDocuments({completed: false});
    return countDocuments;
};

findAndDelete('5d603cbb4205fb1977ae52ac').then((count) => {
    console.log('Not completed tasks count: ' + count);
}).catch((e) => {
    console.log(e);
});

/*
Task.findByIdAndDelete('5d603c507354201953f9edb8').then(res => {
    console.log(res);
    return Task.countDocuments({completed: false});
}).then(data => {
    console.log(data);
}).catch(e => {
    console.log(e);
}); */
